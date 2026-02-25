package com.app.controller;

import com.app.dto.MessageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    @GetMapping("/public")
    public ResponseEntity<?> publicContent() {
        return ResponseEntity.ok(new MessageResponse("Bienvenue ! Ceci est un contenu public accessible à tous."));
    }

    @GetMapping("/protected")
    public ResponseEntity<?> protectedContent(Authentication authentication) {
        return ResponseEntity.ok(new MessageResponse(
                "Bonjour " + authentication.getName()
                        + " ! Ceci est un contenu protégé réservé aux utilisateurs connectés."));
    }
}
