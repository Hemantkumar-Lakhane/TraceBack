package com.traceback.api.controller;

import com.traceback.api.model.Conversation;
import com.traceback.api.model.Message;
import com.traceback.api.model.User;
import com.traceback.api.repository.ConversationRepository;
import com.traceback.api.repository.UserRepository;
import com.traceback.api.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ChatService chatService;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public ConversationController(ChatService chatService,
                                  ConversationRepository conversationRepository,
                                  UserRepository userRepository) {
        this.chatService = chatService;
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    @Operation(summary = "Get user's active conversations")
    public ResponseEntity<List<Conversation>> getMyConversations(Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(chatService.getUserConversations(user));
    }

    @GetMapping("/by-match/{matchId}")
    @Operation(summary = "Get conversation corresponding to a match record ID")
    public ResponseEntity<?> getConversationByMatchId(@PathVariable Long matchId, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return conversationRepository.findByMatchRecordId(matchId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/messages")
    @Operation(summary = "Get historical messages for a conversation")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long id, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(chatService.getMessages(id, user));
    }

    @PostMapping("/{id}/messages")
    @Operation(summary = "Send a message in a conversation")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Principal principal) {

        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();

        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "content is required"));
        }

        Message sent = chatService.sendMessage(id, user, content.trim());
        return new ResponseEntity<>(sent, HttpStatus.CREATED);
    }
}
