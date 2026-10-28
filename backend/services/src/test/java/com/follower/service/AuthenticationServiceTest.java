package com.follower.service;

import com.follower.model.LoginRequest;
import com.follower.model.RegistrationRequest;
import com.follower.repository.RegistrationRepository;
import com.follower.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {
    @Mock
    private UserRepository users;

    @Mock
    private RegistrationRepository registrations;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthenticationService authenticationService;

    @Test
    void registrationNormalizesEmailAndCreatesPendingRequest() {
        when(users.existsByEmail("ana@example.com")).thenReturn(false);
        when(users.create(any(RegistrationRequest.class))).thenReturn(27L);

        var result = new RegistrationService(users, registrations)
                .register(new RegistrationRequest(" Ana ", " Pérez ", " López ",
                        " Ana@Example.com ", "password123", " Ingeniería de Software ", true));

        ArgumentCaptor<RegistrationRequest> requestCaptor = ArgumentCaptor.forClass(RegistrationRequest.class);
        verify(users).create(requestCaptor.capture());
        assertEquals("ana@example.com", requestCaptor.getValue().email());
        assertEquals("Ana", requestCaptor.getValue().firstName());
        verify(registrations).createPendingRequest(27L);
        assertEquals("PENDING", result.status());
    }

    @Test
    void registrationRejectsDuplicateEmail() {
        when(users.existsByEmail("ana@example.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class,
                () -> new RegistrationService(users, registrations).register(registrationRequest()));

        verify(users, never()).create(any(RegistrationRequest.class));
        verifyNoInteractions(registrations);
    }

    @Test
    void registrationRejectsMissingFieldsWithoutThrowingNullPointerException() {
        var request = new RegistrationRequest(null, "Pérez", "López", "ana@example.com",
                "password123", "Ingeniería de Software", true);

        assertThrows(IllegalArgumentException.class,
                () -> new RegistrationService(users, registrations).register(request));

        verifyNoInteractions(users, registrations);
    }

    @Test
    void loginAcceptsActiveUserWithCaseInsensitiveEmail() {
        when(users.findForLogin("ana@example.com"))
                .thenReturn(Optional.of(new UserRepository.UserLoginRow(27L, "password-hash", "ACTIVE")));
        when(passwordEncoder.matches("password123", "password-hash")).thenReturn(true);

        var result = authenticationService.login(new LoginRequest(" ANA@Example.com ", "password123"));

        assertEquals("ACTIVE", result.status());
        verifyNoInteractions(registrations);
    }

    @Test
    void loginReturnsPendingStatusForCorrectPendingCredentials() {
        when(users.findForLogin("ana@example.com"))
                .thenReturn(Optional.of(new UserRepository.UserLoginRow(27L, "password-hash", "PENDING")));
        when(passwordEncoder.matches("password123", "password-hash")).thenReturn(true);
        when(registrations.findStatus(27L)).thenReturn("PENDING");

        var result = authenticationService.login(new LoginRequest("ana@example.com", "password123"));

        assertEquals("PENDING", result.status());
        assertTrue(result.message().contains("aún está siendo analizada"));
    }

    @Test
    void loginRejectsIncorrectPasswordAndMissingCredentials() {
        when(users.findForLogin("ana@example.com"))
                .thenReturn(Optional.of(new UserRepository.UserLoginRow(27L, "password-hash", "ACTIVE")));
        when(passwordEncoder.matches("wrong-password", "password-hash")).thenReturn(false);

        assertThrows(IllegalArgumentException.class,
                () -> authenticationService.login(new LoginRequest("ana@example.com", "wrong-password")));
        assertThrows(IllegalArgumentException.class,
                () -> authenticationService.login(new LoginRequest("ana@example.com", null)));
    }

    @Test
    void registrationReportsConcurrentDuplicateEmail() {
        when(users.existsByEmail("ana@example.com")).thenReturn(false);
        when(users.create(any(RegistrationRequest.class)))
                .thenThrow(new DuplicateKeyException("duplicate email"));

        assertThrows(IllegalArgumentException.class,
                () -> new RegistrationService(users, registrations).register(registrationRequest()));

        verifyNoInteractions(registrations);
    }

    private RegistrationRequest registrationRequest() {
        return new RegistrationRequest("Ana", "Pérez", "López", "ana@example.com",
                "password123", "Ingeniería de Software", true);
    }
}
