package com.jobportal.controller;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.entity.Application;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.exception.BadRequestException;
import com.jobportal.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

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

    @DeleteMapping("/applications/{applicationId}")
    public ResponseEntity<Map<String, String>> withdrawApplication(
            @PathVariable Long applicationId,
            @RequestParam Long userId) {
        candidateService.withdrawApplication(applicationId, userId);
        return ResponseEntity.ok(Map.of("message", "Application withdrawn successfully"));
    }

    @PostMapping("/profile/{userId}/resume")
    public ResponseEntity<Map<String, String>> uploadResume(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        if (!"application/pdf".equals(file.getContentType())) {
            throw new BadRequestException("Only PDF files are allowed");
        }
        candidateService.uploadResume(userId, file);
        return ResponseEntity.ok(Map.of("message", "Resume uploaded successfully"));
    }

    @GetMapping("/profile/{userId}/resume")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long userId) {
        CandidateProfile profile = candidateService.getResumeData(userId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + profile.getResumeFileName() + "\"")
                .contentType(MediaType.parseMediaType(profile.getResumeContentType()))
                .body(profile.getResumeData());
    }

    @DeleteMapping("/profile/{userId}/resume")
    public ResponseEntity<Map<String, String>> deleteResume(@PathVariable Long userId) {
        candidateService.deleteResume(userId);
        return ResponseEntity.ok(Map.of("message", "Resume deleted successfully"));
    }
}
