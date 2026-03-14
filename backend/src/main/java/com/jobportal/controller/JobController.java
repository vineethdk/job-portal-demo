package com.jobportal.controller;

import com.jobportal.entity.Job;
import com.jobportal.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) Double maxSalary,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(jobService.searchJobs(skill, minExperience, maxSalary, location));
    }
}
