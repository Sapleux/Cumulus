package com.app.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{localisation}")
    public void greeting(@DestinationVariable String localisation, ChatMessage message) {
        if (message == null || message.getText() == null || message.getText().isBlank()) {
            return;
        }

        ChatMessage payload = new ChatMessage(
            message.getAuthor() == null || message.getAuthor().isBlank() ? "anonymous" : message.getAuthor(),
            message.getText().trim()
        );

        messagingTemplate.convertAndSend("/topic/message/" + localisation, payload);
    }

}
