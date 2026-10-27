package com.follower.model;

public record JobOpportunity(
        long id,
        String organization,
        String publisherName,
        String title,
        String description
) {}
