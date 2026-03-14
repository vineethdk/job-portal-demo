package com.jobportal.controller;

import com.jobportal.dto.JobRequest;
import com.jobportal.dto.StatusUpdateRequest;
import com.jobportal.entity.Application;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.Job;
import com.jobportal.service.HrService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr")
public class HrController {

    private final HrService hrService;

    public HrController(HrService hrService) {
        this.hrService = hrService;
    }

    @PostMapping("/jobs")
    public ResponseEntity<Job> createJob(@Valid @RequestBody JobRequest request) {
        Job job = hrService.createJob(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(job);
    }

    @GetMapping("/jobs/{userId}")
    public ResponseEntity<List<Job>> getJobsByHr(@PathVariable Long userId) {
        return ResponseEntity.ok(hrService.getJobsByHr(userId));
    }

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<Application>> getApplicationsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(hrService.getApplicationsForJob(jobId));
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(hrService.updateApplicationStatus(applicationId, request.getStatus()));
    }

    @GetMapping("/candidates/search")
    public ResponseEntity<List<CandidateProfile>> searchCandidates(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) Double maxSalary,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(hrService.searchCandidates(skill, minExperience, maxSalary, location));
    }
}
