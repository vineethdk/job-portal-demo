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
}
