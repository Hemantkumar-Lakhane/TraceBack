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

@Controller
public class WebSocketChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;

    public WebSocketChatController(ChatService chatService, UserRepository userRepository) {
        this.chatService = chatService;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat/{conversationId}")
    public void handleChatMessage(
            @DestinationVariable Long conversationId,
            @Payload ChatMessageDto payload,
            Principal principal) {

        User sender = null;
        if (principal != null) {
            sender = userRepository.findByEmail(principal.getName()).orElse(null);
        } else if (payload.getSenderId() != null) {
            sender = userRepository.findById(payload.getSenderId()).orElse(null);
        }

        if (sender == null) {
            throw new IllegalArgumentException("Unknown or unauthenticated sender");
        }

        if (payload.getContent() == null || payload.getContent().trim().isEmpty()) {
            return;
        }

        chatService.sendMessage(conversationId, sender, payload.getContent().trim());
    }
}

