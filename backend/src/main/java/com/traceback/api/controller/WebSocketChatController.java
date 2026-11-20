package com.traceback.api.controller;

import com.traceback.api.dto.ChatMessageDto;
import com.traceback.api.model.User;
import com.traceback.api.repository.UserRepository;
import com.traceback.api.service.ChatService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

// Controller handling real-time chat messages sent via STOMP frames
@Controller
public class WebSocketChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;

    public WebSocketChatController(ChatService chatService, UserRepository userRepository) {
        this.chatService = chatService;
        this.userRepository = userRepository;
    }

    // Handles messages published by clients to /app/chat/{conversationId}
    @MessageMapping("/chat/{conversationId}")
    public void handleChatMessage(
            @DestinationVariable Long conversationId, // Target room ID
            @Payload ChatMessageDto payload,          // Incoming message body (JSON)
            Principal principal) {                    // Authenticated user principal from JWT

        // 1. Identify the sender via authenticated Principal or payload ID
        User sender = null;
        if (principal != null) {
            sender = userRepository.findByEmail(principal.getName()).orElse(null);
        } else if (payload.getSenderId() != null) {
            sender = userRepository.findById(payload.getSenderId()).orElse(null);
        }

        if (sender == null) {
            throw new IllegalArgumentException("Unknown or unauthenticated sender");
        }

        // 2. Reject empty messages
        if (payload.getContent() == null || payload.getContent().trim().isEmpty()) {
            return;
        }

        // 3. Delegate message persistence and /topic broadcast to ChatService
        chatService.sendMessage(conversationId, sender, payload.getContent().trim());
    }
}

