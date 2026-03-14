package com.jobportal.service;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.entity.Application;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.enums.Role;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CandidateProfileRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class CandidateService {

    private final CandidateProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public CandidateService(CandidateProfileRepository profileRepository,
                            UserRepository userRepository,
                            JobRepository jobRepository,
                            ApplicationRepository applicationRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public CandidateProfile getProfile(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user id: " + userId));
    }

    public CandidateProfile createOrUpdateProfile(Long userId, CandidateProfile profileData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() != Role.CANDIDATE) {
            throw new BadRequestException("Only candidates can have profiles");
        }

        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElse(new CandidateProfile());

        // Validate profile fields
        if (profileData.getSkills() == null || profileData.getSkills().isBlank()) {
            throw new BadRequestException("Skills are required");
        }
        if (profileData.getExperienceYears() < 0 || profileData.getExperienceYears() > 50) {
            throw new BadRequestException("Experience must be between 0 and 50 years");
        }
        if (profileData.getExpectedSalary() < 0) {
            throw new BadRequestException("Expected salary cannot be negative");
        }
        if (profileData.getLocation() == null || profileData.getLocation().isBlank()) {
            throw new BadRequestException("Location is required");
        }
        if (profileData.getResumeHeadline() == null || profileData.getResumeHeadline().isBlank()) {
            throw new BadRequestException("Resume headline is required");
        }

        profile.setUser(user);
        profile.setSkills(profileData.getSkills());
        profile.setExperienceYears(profileData.getExperienceYears());
        profile.setExpectedSalary(profileData.getExpectedSalary());
        profile.setLocation(profileData.getLocation());
        profile.setResumeHeadline(profileData.getResumeHeadline());

        return profileRepository.save(profile);
    }

    public Application applyForJob(ApplicationRequest request) {
        User candidate = userRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + request.getCandidateId()));

        if (candidate.getRole() != Role.CANDIDATE) {
            throw new BadRequestException("Only candidates can apply for jobs");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + request.getJobId()));

        if (applicationRepository.existsByCandidateIdAndJobId(request.getCandidateId(), request.getJobId())) {
            throw new BadRequestException("You have already applied for this job");
        }

        Application application = new Application(candidate, job);
        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByUser(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return applicationRepository.findByCandidateIdOrderByAppliedAtDesc(userId);
    }

    public void uploadResume(Long userId, MultipartFile file) {
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));
        try {
            profile.setResumeData(file.getBytes());
            profile.setResumeFileName(file.getOriginalFilename());
            profile.setResumeContentType(file.getContentType());
            profileRepository.save(profile);
        } catch (IOException e) {
            throw new BadRequestException("Failed to upload resume");
        }
    }

    public CandidateProfile getResumeData(Long userId) {
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));
        if (profile.getResumeData() == null) {
            throw new ResourceNotFoundException("No resume found for user: " + userId);
        }
        return profile;
    }

    public void deleteResume(Long userId) {
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));
        profile.setResumeData(null);
        profile.setResumeFileName(null);
        profile.setResumeContentType(null);
        profileRepository.save(profile);
    }
}
