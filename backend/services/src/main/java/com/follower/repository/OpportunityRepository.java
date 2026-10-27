package com.follower.repository;

import com.follower.model.JobOpportunity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OpportunityRepository {
    private final JdbcTemplate jdbc;

    public OpportunityRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<JobOpportunity> findLatest() {
        return jdbc.query("""
                SELECT id, organization, publisher_name, title, description
                FROM job_opportunities ORDER BY created_timestamp DESC
                """, (rs, rowNum) -> new JobOpportunity(
                rs.getLong("id"), rs.getString("organization"),
                rs.getString("publisher_name"), rs.getString("title"),
                rs.getString("description")));
    }
}
