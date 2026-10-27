package com.follower.model;

public record RegistrationRequest(
        String firstName,
        String fatherLastName,
        String motherLastName,
        String email,
        String password,
        String major,
        boolean privacyAccepted
) {}
