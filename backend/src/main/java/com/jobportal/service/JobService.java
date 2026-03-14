package com.jobportal.service;

import com.jobportal.entity.Job;
import com.jobportal.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> searchJobs(String skill, Integer minExperience, Double maxSalary, String location) {
        return jobRepository.searchJobs(
                (skill != null && !skill.isBlank()) ? skill : null,
                minExperience,
                maxSalary,
                (location != null && !location.isBlank()) ? location : null
        );
    }
}
