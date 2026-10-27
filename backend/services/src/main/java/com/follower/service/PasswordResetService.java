package com.follower.service;

import com.follower.model.ApiMessage;
import com.follower.model.PasswordResetRequest;
import com.follower.repository.UserRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.HexFormat;

@Service
public class PasswordResetService {
    private final UserRepository users;
    private final JdbcTemplate jdbc;
    private final SecureRandom random = new SecureRandom();

    public PasswordResetService(UserRepository users, JdbcTemplate jdbc) {
        this.users = users;
        this.jdbc = jdbc;
    }

    public ApiMessage requestReset(PasswordResetRequest request) {
        if (request == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Proporciona un correo electrónico válido.");
        }
        users.findIdByEmail(request.email().trim()).ifPresent(userId -> {
            byte[] bytes = new byte[32];
            random.nextBytes(bytes);
            String rawToken = HexFormat.of().formatHex(bytes);
            jdbc.update("""
                    INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
                    VALUES (?, ?, CURRENT_TIMESTAMP + INTERVAL '30 minutes')
                    """, userId, hash(rawToken));
            // La entrega real del enlace se conecta aquí con el proveedor de correo institucional.
        });
        return new ApiMessage(
                "Si el correo está registrado, recibirás un enlace para restablecer tu acceso.",
                "REQUESTED");
    }

    private String hash(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("No se pudo preparar el token de recuperación.", exception);
        }
    }
}
