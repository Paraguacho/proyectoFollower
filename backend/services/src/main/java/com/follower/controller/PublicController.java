package com.follower.controller;

import com.follower.model.JobOpportunity;
import com.follower.repository.OpportunityRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    private final OpportunityRepository opportunities;

    public PublicController(OpportunityRepository opportunities) {
        this.opportunities = opportunities;
    }

    @GetMapping("/opportunities")
    public List<JobOpportunity> opportunities() {
        return opportunities.findLatest();
    }
}
