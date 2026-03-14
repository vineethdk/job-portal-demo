package com.jobportal.service;

import com.jobportal.dto.JobRequest;
import com.jobportal.entity.Application;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.enums.Role;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CandidateProfileRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HrService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    public HrService(JobRepository jobRepository,
                     UserRepository userRepository,
                     ApplicationRepository applicationRepository,
                     CandidateProfileRepository candidateProfileRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.candidateProfileRepository = candidateProfileRepository;
    }

    public Job createJob(JobRequest request) {
        User hr = userRepository.findById(request.getPostedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getPostedBy()));

        if (hr.getRole() != Role.HR_ADMIN) {
            throw new BadRequestException("Only HR admins can post jobs");
        }

        Job job = new Job();
        job.setPostedBy(hr);
        job.setCompanyName(hr.getCompanyName());
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setMinExperience(request.getMinExperience());
        job.setMaxSalary(request.getMaxSalary());
        job.setLocation(request.getLocation());

        return jobRepository.save(job);
    }

    public List<Job> getJobsByHr(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return jobRepository.findByPostedByIdOrderByCreatedAtDesc(userId);
    }

    public List<Application> getApplicationsForJob(Long jobId) {
        jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
    }

    public Application updateApplicationStatus(Long applicationId, String statusStr) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        ApplicationStatus status;
        try {
            status = ApplicationStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status. Must be one of: APPLIED, SHORTLISTED, REJECTED, HIRED");
        }

        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public List<CandidateProfile> searchCandidates(String skill, Integer minExperience, Double maxSalary, String location) {
        return candidateProfileRepository.searchCandidates(
                (skill != null && !skill.isBlank()) ? skill : null,
                minExperience,
                maxSalary,
                (location != null && !location.isBlank()) ? location : null
        );
    }
}
