package com.follower.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RegistrationRepository {
    private final JdbcTemplate jdbc;

    public RegistrationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void createPendingRequest(long userId) {
        jdbc.update("INSERT INTO registration_requests (user_id) VALUES (?)", userId);
    }

    public String findStatus(long userId) {
        return jdbc.queryForObject("""
                SELECT status FROM registration_requests
                WHERE user_id = ? ORDER BY created_timestamp DESC LIMIT 1
                """, String.class, userId);
    }
}
