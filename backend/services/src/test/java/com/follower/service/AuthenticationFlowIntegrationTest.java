package com.follower.service;

import com.follower.model.LoginRequest;
import com.follower.model.RegistrationRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.util.Locale;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@EnabledIfSystemProperty(named = "follower.integration-tests", matches = "true")
class AuthenticationFlowIntegrationTest {
    private static final String PASSWORD = "secure-test-password";

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String email;

    @BeforeEach
    void setUp() {
        email = "follower-test-" + UUID.randomUUID() + "@example.test";
    }

    @AfterEach
    void cleanUp() {
        jdbc.update("DELETE FROM users WHERE lower(email) = lower(?)", email);
    }

    @Test
    void registrationPersistsPasswordHashAndPendingRequestAndAllowsLogin() {
        var result = registrationService.register(registrationRequest(email));

        assertEquals("PENDING", result.status());
        var storedUser = jdbc.queryForMap(
                "SELECT password_hash, account_status FROM users WHERE email = ?", email.toLowerCase(Locale.ROOT));
        String passwordHash = (String) storedUser.get("password_hash");
        assertFalse(PASSWORD.equals(passwordHash));
        assertTrue(passwordEncoder.matches(PASSWORD, passwordHash));
        assertEquals("PENDING", storedUser.get("account_status"));
        assertEquals(1, jdbc.queryForObject(
                "SELECT COUNT(*) FROM registration_requests r JOIN users u ON u.id = r.user_id WHERE u.email = ?",
                Integer.class, email.toLowerCase(Locale.ROOT)));

        var loginResult = authenticationService.login(
                new LoginRequest(email.toUpperCase(Locale.ROOT), PASSWORD));

        assertEquals("PENDING", loginResult.status());
    }

    @Test
    void registrationRejectsDuplicateEmailRegardlessOfCase() {
        registrationService.register(registrationRequest(email));

        assertThrows(IllegalArgumentException.class,
                () -> registrationService.register(registrationRequest(email.toUpperCase(Locale.ROOT))));
        assertEquals(1, jdbc.queryForObject(
                "SELECT COUNT(*) FROM users WHERE lower(email) = lower(?)", Integer.class, email));
    }

    @Test
    void registrationRejectsMissingFieldsAndLoginRejectsMissingCredentials() {
        assertThrows(IllegalArgumentException.class, () -> registrationService.register(
                new RegistrationRequest(null, "Pérez", "López", email, PASSWORD,
                        "Ingeniería de Software", true)));
        assertThrows(IllegalArgumentException.class,
                () -> authenticationService.login(new LoginRequest(email, null)));
        assertEquals(0, jdbc.queryForObject(
                "SELECT COUNT(*) FROM users WHERE lower(email) = lower(?)", Integer.class, email));
    }

    @Test
    void loginRejectsIncorrectPassword() {
        registrationService.register(registrationRequest(email));

        assertThrows(IllegalArgumentException.class,
                () -> authenticationService.login(new LoginRequest(email, "incorrect-password")));
    }

    private RegistrationRequest registrationRequest(String address) {
        return new RegistrationRequest(
                "Ana", "Pérez", "López", address, PASSWORD, "Ingeniería de Software", true);
    }
}
