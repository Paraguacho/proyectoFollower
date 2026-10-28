package com.follower.repository;

import com.follower.model.RegistrationRequest;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.Optional;

@Repository
public class UserRepository {
    private final JdbcTemplate jdbc;
    private final PasswordEncoder passwordEncoder;

    public UserRepository(JdbcTemplate jdbc, PasswordEncoder passwordEncoder) {
        this.jdbc = jdbc;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean existsByEmail(String email) {
        return Boolean.TRUE.equals(jdbc.queryForObject(
                "SELECT EXISTS (SELECT 1 FROM users WHERE lower(email) = lower(?))",
                Boolean.class, email));
    }

    public long create(RegistrationRequest request) {
        return jdbc.queryForObject("""
                INSERT INTO users
                    (first_name, father_last_name, mother_last_name, email,
                     password_hash, major, privacy_accepted_at)
                VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                RETURNING id
                """, Long.class,
                request.firstName(), request.fatherLastName(), request.motherLastName(),
                request.email().trim().toLowerCase(Locale.ROOT), passwordEncoder.encode(request.password()),
                request.major());
    }

    public Optional<UserLoginRow> findForLogin(String email) {
        try {
            return Optional.ofNullable(jdbc.queryForObject("""
                    SELECT id, password_hash, account_status
                    FROM users WHERE lower(email) = lower(?)
                    """, (rs, rowNum) -> new UserLoginRow(
                    rs.getLong("id"), rs.getString("password_hash"),
                    rs.getString("account_status")), email));
        } catch (EmptyResultDataAccessException exception) {
            return Optional.empty();
        }
    }

    public Optional<Long> findIdByEmail(String email) {
        try {
            return Optional.ofNullable(jdbc.queryForObject(
                    "SELECT id FROM users WHERE lower(email) = lower(?)",
                    Long.class, email));
        } catch (EmptyResultDataAccessException exception) {
            return Optional.empty();
        }
    }

    public record UserLoginRow(long id, String passwordHash, String status) {}
}
