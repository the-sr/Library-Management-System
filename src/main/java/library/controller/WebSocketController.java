package library.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/public-message")  //message sending path "/app/public-message"
    @SendTo("/topic/messages")    // subscribing path "/topic/messages)
    public Object sendPublicMessage(Object message) {
        return message;
    }

    @MessageMapping("/private-message")     //message sending path "/app/private-message"
    public void sendPrivateMessage(Object message) {
        String to="";      //retrieve to from message
        messagingTemplate.convertAndSendToUser(to, "/messages", message);   // subscribing path "/user/to/messages)
    }

}
