package com.traceback.api.service;

import com.traceback.api.model.*;
import com.traceback.api.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;

    public ChatService(ConversationRepository conversationRepository,
                       MessageRepository messageRepository,
                       NotificationRepository notificationRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.notificationRepository = notificationRepository;
    }

    public List<Conversation> getUserConversations(User user) {
        return conversationRepository.findAll().stream()
                .filter(c -> {
                    MatchRecord match = c.getMatchRecord();
                    if (match == null) return false;
                    Long lostUserId = match.getLostReport().getUser().getId();
                    Long foundUserId = match.getFoundReport().getUser().getId();
                    return user.getRole() == Role.ADMIN ||
                           user.getId().equals(lostUserId) ||
                           user.getId().equals(foundUserId);
                })
                .toList();
    }

    public List<Message> getMessages(Long conversationId, User user) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        validateAccess(conversation, user);

        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    @Transactional
    public Message sendMessage(Long conversationId, User sender, String content) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found with ID: " + conversationId));

        validateAccess(conversation, sender);

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(content);

        Message savedMessage = messageRepository.save(message);

        // Notify other participant
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
            notificationRepository.save(notif);
        }

        return savedMessage;
    }

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
