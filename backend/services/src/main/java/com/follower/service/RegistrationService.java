package com.follower.service;

import com.follower.model.ApiMessage;
import com.follower.model.RegistrationRequest;
import com.follower.repository.RegistrationRepository;
import com.follower.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {
    private final UserRepository users;
    private final RegistrationRepository registrations;

    public RegistrationService(UserRepository users, RegistrationRepository registrations) {
        this.users = users;
        this.registrations = registrations;
    }

    @Transactional
    public ApiMessage register(RegistrationRequest request) {
        validate(request);
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new IllegalArgumentException("El correo electrónico ya tiene una solicitud o cuenta.");
        }
        long userId = users.create(request);
        registrations.createPendingRequest(userId);
        return new ApiMessage(
                "Tu información ha sido recibida y está siendo analizada por un coordinador.",
                "PENDING");
    }

    private void validate(RegistrationRequest request) {
        if (request == null || request.firstName().isBlank() || request.fatherLastName().isBlank()
                || request.motherLastName().isBlank() || request.email().isBlank()
                || request.password().length() < 8 || request.major().isBlank()
                || !request.privacyAccepted()) {
            throw new IllegalArgumentException("Completa todos los campos y acepta el Aviso de Privacidad.");
        }
    }
}
