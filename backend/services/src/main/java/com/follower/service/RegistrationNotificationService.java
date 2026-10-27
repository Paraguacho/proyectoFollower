package com.follower.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class RegistrationNotificationService {
    private final JavaMailSender mailSender;
    private final String sender;

    public RegistrationNotificationService(JavaMailSender mailSender,
                                           @Value("${follower.mail.from}") String sender) {
        this.mailSender = mailSender;
        this.sender = sender;
    }

    public void sendResolution(String recipient, boolean approved) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(sender);
        message.setTo(recipient);
        message.setSubject(approved
                ? "Tu registro en EGRESADOS FOLLOWER fue aprobado"
                : "Actualización de tu solicitud en EGRESADOS FOLLOWER");
        message.setText(approved ? approvedBody() : rejectedBody());
        mailSender.send(message);
    }

    private String approvedBody() {
        return """
                Hola,

                ¡Tu registro ha sido aprobado!
                Tu solicitud en la Plataforma de Egresados fue validada exitosamente.
                Ya puedes iniciar sesión con tu correo y contraseña registrados.

                EGRESADOS FOLLOWER
                """;
    }

    private String rejectedBody() {
        return """
                Hola,

                Tu solicitud de registro en la Plataforma de Egresados no ha podido
                ser validada en esta ocasión.

                Comunícate con el administrador o coordinador de tu programa educativo
                para revisar tu situación.

                EGRESADOS FOLLOWER
                """;
    }
}
