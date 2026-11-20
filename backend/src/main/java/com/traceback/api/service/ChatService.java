package com.traceback.api.service;

import com.traceback.api.model.*;
import com.traceback.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatService(ConversationRepository conversationRepository,
                       MessageRepository messageRepository,
                       NotificationRepository notificationRepository,
                       @Autowired(required = false) SimpMessagingTemplate messagingTemplate) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // Fetch conversations accessible to the current user (only where user is loser or finder)
    public List<Conversation> getUserConversations(User user) {
        return conversationRepository.findAll().stream()
                .filter(c -> {
                    MatchRecord match = c.getMatchRecord();
                    if (match == null) return false;
                    Long lostUserId = match.getLostReport().getUser().getId();
                    Long foundUserId = match.getFoundReport().getUser().getId();
                    // ADMINs can view all; students only view their own matches
                    return user.getRole() == Role.ADMIN ||
                           user.getId().equals(lostUserId) ||
                           user.getId().equals(foundUserId);
                })
                .toList();
    }

    // Retrieve historical message logs ordered chronologically
    public List<Message> getMessages(Long conversationId, User user) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        validateAccess(conversation, user); // Authorization check: user must belong to this room

        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    // Persist a new message and broadcast it via WebSocket
    @Transactional // Executes inside an atomic database transaction
    public Message sendMessage(Long conversationId, User sender, String content) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        validateAccess(conversation, sender); // Prevent unauthorized spoofing

        // 1. Build and persist message entity
        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(content);

        Message savedMessage = messageRepository.save(message);

        // 2. Determine who the other student is to send notification
        MatchRecord match = conversation.getMatchRecord();
        User receiver = match.getLostReport().getUser().getId().equals(sender.getId())
                ? match.getFoundReport().getUser()
                : match.getLostReport().getUser();

        if (receiver != null && !receiver.getId().equals(sender.getId())) {
            Notification notif = new Notification();
            notif.setUser(receiver);
            notif.setType("CHAT");
            notif.setMessage("New message from " + sender.getName() + " regarding " + match.getLostReport().getItem().getName());
            notif.setReferenceId(conversation.getId());
            Notification savedNotif = notificationRepository.save(notif);

            // Push real-time notification to receiver's private queue
            if (messagingTemplate != null) {
                try {
                    messagingTemplate.convertAndSend("/topic/notifications/" + receiver.getId(), savedNotif);
                } catch (Exception ignored) {}
            }
        }

        // 3. Broadcast the message live to all subscribers in this room (/topic/chat/{conversationId})
        if (messagingTemplate != null) {
            try {
                messagingTemplate.convertAndSend("/topic/chat/" + conversationId, savedMessage);
            } catch (Exception ignored) {}
        }

        return savedMessage;
    }

    // Role-based security guardrail: prevents students from reading rooms they do not own
    private void validateAccess(Conversation conversation, User user) {
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.SECURITY) return;

        MatchRecord match = conversation.getMatchRecord();
        Long lostUserId = match.getLostReport().getUser().getId();
        Long foundUserId = match.getFoundReport().getUser().getId();

        if (!user.getId().equals(lostUserId) && !user.getId().equals(foundUserId)) {
            throw new SecurityException("Unauthorized access to this conversation");
        }
    }
}
