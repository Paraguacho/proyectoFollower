package com.follower.controller;

import com.follower.model.ApiMessage;
import com.follower.model.PasswordResetRequest;
import com.follower.service.PasswordResetService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/password-resets")
public class PasswordResetController {
    private final PasswordResetService service;

    public PasswordResetController(PasswordResetService service) {
        this.service = service;
    }

    @PostMapping
    public ApiMessage requestReset(@RequestBody PasswordResetRequest request) {
        try {
            return service.requestReset(request);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
    }
}
