package com.jobportal.controller;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.entity.Application;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<CandidateProfile> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(candidateService.getProfile(userId));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<CandidateProfile> createOrUpdateProfile(
            @PathVariable Long userId,
            @RequestBody CandidateProfile profile) {
        return ResponseEntity.ok(candidateService.createOrUpdateProfile(userId, profile));
    }

    @PostMapping("/apply")
    public ResponseEntity<Application> apply(@Valid @RequestBody ApplicationRequest request) {
        Application application = candidateService.applyForJob(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(application);
    }

    @GetMapping("/applications/{userId}")
    public ResponseEntity<List<Application>> getApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(candidateService.getApplicationsByUser(userId));
    }
}
