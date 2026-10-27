package com.follower.service;

import com.follower.model.ApiMessage;
import com.follower.model.LoginRequest;
import com.follower.repository.RegistrationRepository;
import com.follower.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository users;
    private final RegistrationRepository registrations;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository users, RegistrationRepository registrations,
                                 PasswordEncoder passwordEncoder) {
        this.users = users;
        this.registrations = registrations;
        this.passwordEncoder = passwordEncoder;
    }

    public ApiMessage login(LoginRequest request) {
        var user = users.findForLogin(request.email().trim());
        if (user.isEmpty() || !passwordEncoder.matches(request.password(), user.get().passwordHash())) {
            throw new IllegalArgumentException(
                    "El correo electrónico o la contraseña son incorrectos. Por favor, verifica tus datos.");
        }
        if (!"ACTIVE".equals(user.get().status())) {
            String status = registrations.findStatus(user.get().id());
            if ("PENDING".equals(status)) {
                return new ApiMessage(
                        "Tus credenciales son correctas, pero tu solicitud aún está siendo analizada.",
                        "PENDING");
            }
            throw new IllegalArgumentException("Tu solicitud de registro no fue aprobada.");
        }
        return new ApiMessage("Inicio de sesión correcto.", "ACTIVE");
    }
}
