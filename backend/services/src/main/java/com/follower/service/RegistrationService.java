package com.follower.service;

import com.follower.model.ApiMessage;
import com.follower.model.RegistrationRequest;
import com.follower.repository.RegistrationRepository;
import com.follower.repository.UserRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class RegistrationService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[^\\s@]+@[^\\s@]+\\.[^\\s@]+");

    private final UserRepository users;
    private final RegistrationRepository registrations;

    public RegistrationService(UserRepository users, RegistrationRepository registrations) {
        this.users = users;
        this.registrations = registrations;
    }

    @Transactional
    public ApiMessage register(RegistrationRequest request) {
        validate(request);
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (users.existsByEmail(email)) {
            throw new IllegalArgumentException("El correo electrónico ya tiene una solicitud o cuenta.");
        }
        RegistrationRequest cleanedRequest = new RegistrationRequest(
                request.firstName().trim(),
                request.fatherLastName().trim(),
                request.motherLastName().trim(),
                email,
                request.password(),
                request.major().trim(),
                request.privacyAccepted());
        long userId;
        try {
            userId = users.create(cleanedRequest);
        } catch (DuplicateKeyException exception) {
            throw new IllegalArgumentException(
                    "El correo electrónico ya tiene una solicitud o cuenta.", exception);
        }
        registrations.createPendingRequest(userId);
        return new ApiMessage(
                "Tu información ha sido recibida y está siendo analizada por un coordinador.",
                "PENDING");
    }

    private void validate(RegistrationRequest request) {
        if (request == null || !hasText(request.firstName()) || !hasText(request.fatherLastName())
                || !hasText(request.motherLastName()) || !hasText(request.email())
                || !hasText(request.password()) || !hasText(request.major())
                || request.password().length() < 8 || !request.privacyAccepted()) {
            throw new IllegalArgumentException("Completa todos los campos y acepta el Aviso de Privacidad.");
        }
        String email = request.email().trim();
        if (email.length() > 255 || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Ingresa un correo electrónico válido.");
        }
        if (request.firstName().trim().length() > 80 || request.fatherLastName().trim().length() > 80
                || request.motherLastName().trim().length() > 80 || request.major().trim().length() > 160) {
            throw new IllegalArgumentException("Revisa la longitud de los campos ingresados.");
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
