package com.traceback.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// WebSocket STOMP broker configuration for real-time chat & notifications
@Configuration
@EnableWebSocketMessageBroker // Enables WebSocket message handling backed by a message broker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // In-memory broker: sends outgoing messages to subscribers on /topic (rooms) &
        // /queue (user-specific)
        config.enableSimpleBroker("/topic", "/queue");

        // Incoming messages from clients must start with /app (routed to
        // @MessageMapping controllers)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Handshake endpoint: ws://localhost:8080/ws with SockJS fallback for browsers
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Allows cross-origin connection from Vite dev server & Vercel
                .withSockJS();

        // Direct WebSocket endpoint without SockJS
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }
}
