package com.jobportal.service;

import com.jobportal.dto.ApplicationRequest;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CandidateServiceTest {

    @Mock
    private CandidateProfileRepository profileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private CandidateService candidateService;

    private User candidateUser;
    private CandidateProfile profile;
    private Job job;

    @BeforeEach
    void setUp() {
        candidateUser = new User("candidate1", "password", Role.CANDIDATE, "Candidate One", null);
        candidateUser.setId(1L);

        profile = new CandidateProfile(candidateUser, "Java,Spring", 3, 80000.0, "Mumbai", "Java Developer");
        profile.setId(1L);

        User hrUser = new User("hr1", "password", Role.HR_ADMIN, "HR Admin", "TechCorp");
        hrUser.setId(2L);

        job = new Job();
        job.setId(1L);
        job.setPostedBy(hrUser);
        job.setCompanyName("TechCorp");
        job.setTitle("Java Developer");
        job.setRequiredSkills("Java,Spring");
        job.setMinExperience(2);
        job.setMaxSalary(100000.0);
        job.setLocation("Mumbai");
    }

    @Test
    @DisplayName("getProfile: returns profile when exists")
    void getProfile_returnsProfileWhenExists() {
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));

        CandidateProfile result = candidateService.getProfile(1L);

        assertThat(result).isNotNull();
        assertThat(result.getSkills()).isEqualTo("Java,Spring");
        assertThat(result.getUser().getUsername()).isEqualTo("candidate1");
        verify(profileRepository).findByUserId(1L);
    }

    @Test
    @DisplayName("getProfile: throws ResourceNotFoundException when not found")
    void getProfile_throwsWhenNotFound() {
        when(profileRepository.findByUserId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateService.getProfile(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Profile not found for user id: 99");
    }

    @Test
    @DisplayName("createOrUpdateProfile: creates new profile")
    void createOrUpdateProfile_createsNewProfile() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(candidateUser));
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.empty());

        CandidateProfile inputProfile = new CandidateProfile();
        inputProfile.setSkills("Python,Django");
        inputProfile.setExperienceYears(2);
        inputProfile.setExpectedSalary(70000.0);
        inputProfile.setLocation("Delhi");
        inputProfile.setResumeHeadline("Python Developer");

        CandidateProfile savedProfile = new CandidateProfile(candidateUser, "Python,Django", 2, 70000.0, "Delhi", "Python Developer");
        savedProfile.setId(1L);
        when(profileRepository.save(any(CandidateProfile.class))).thenReturn(savedProfile);

        CandidateProfile result = candidateService.createOrUpdateProfile(1L, inputProfile);

        assertThat(result).isNotNull();
        assertThat(result.getSkills()).isEqualTo("Python,Django");
        assertThat(result.getLocation()).isEqualTo("Delhi");
        verify(profileRepository).save(any(CandidateProfile.class));
    }

    @Test
    @DisplayName("createOrUpdateProfile: updates existing profile")
    void createOrUpdateProfile_updatesExistingProfile() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(candidateUser));
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));

        CandidateProfile updatedData = new CandidateProfile();
        updatedData.setSkills("Java,Spring,Microservices");
        updatedData.setExperienceYears(5);
        updatedData.setExpectedSalary(120000.0);
        updatedData.setLocation("Bangalore");
        updatedData.setResumeHeadline("Senior Java Developer");

        CandidateProfile savedProfile = new CandidateProfile(candidateUser, "Java,Spring,Microservices", 5, 120000.0, "Bangalore", "Senior Java Developer");
        savedProfile.setId(1L);
        when(profileRepository.save(any(CandidateProfile.class))).thenReturn(savedProfile);

        CandidateProfile result = candidateService.createOrUpdateProfile(1L, updatedData);

        assertThat(result).isNotNull();
        assertThat(result.getSkills()).isEqualTo("Java,Spring,Microservices");
        assertThat(result.getExperienceYears()).isEqualTo(5);
        verify(profileRepository).save(any(CandidateProfile.class));
    }

    @Test
    @DisplayName("applyForJob: successful application")
    void applyForJob_successful() {
        ApplicationRequest request = new ApplicationRequest();
        request.setCandidateId(1L);
        request.setJobId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(candidateUser));
        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByCandidateIdAndJobId(1L, 1L)).thenReturn(false);

        Application savedApp = new Application(candidateUser, job);
        savedApp.setId(1L);
        when(applicationRepository.save(any(Application.class))).thenReturn(savedApp);

        Application result = candidateService.applyForJob(request);

        assertThat(result).isNotNull();
        assertThat(result.getCandidate().getUsername()).isEqualTo("candidate1");
        assertThat(result.getJob().getTitle()).isEqualTo("Java Developer");
        assertThat(result.getStatus()).isEqualTo(ApplicationStatus.APPLIED);
        verify(applicationRepository).save(any(Application.class));
    }

    @Test
    @DisplayName("applyForJob: throws BadRequestException for duplicate application")
    void applyForJob_throwsForDuplicateApplication() {
        ApplicationRequest request = new ApplicationRequest();
        request.setCandidateId(1L);
        request.setJobId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(candidateUser));
        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByCandidateIdAndJobId(1L, 1L)).thenReturn(true);

        assertThatThrownBy(() -> candidateService.applyForJob(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("You have already applied for this job");

        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("applyForJob: throws ResourceNotFoundException for non-existent candidate")
    void applyForJob_throwsForNonExistentCandidate() {
        ApplicationRequest request = new ApplicationRequest();
        request.setCandidateId(99L);
        request.setJobId(1L);

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateService.applyForJob(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Candidate not found with id: 99");
    }

    @Test
    @DisplayName("applyForJob: throws ResourceNotFoundException for non-existent job")
    void applyForJob_throwsForNonExistentJob() {
        ApplicationRequest request = new ApplicationRequest();
        request.setCandidateId(1L);
        request.setJobId(99L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(candidateUser));
        when(jobRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> candidateService.applyForJob(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Job not found with id: 99");
    }

    @Test
    @DisplayName("getApplicationsByUser: returns applications list")
    void getApplicationsByUser_returnsApplicationsList() {
        Application app1 = new Application(candidateUser, job);
        app1.setId(1L);
        Application app2 = new Application(candidateUser, job);
        app2.setId(2L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(candidateUser));
        when(applicationRepository.findByCandidateIdOrderByAppliedAtDesc(1L))
                .thenReturn(Arrays.asList(app1, app2));

        List<Application> result = candidateService.getApplicationsByUser(1L);

        assertThat(result).hasSize(2);
        verify(applicationRepository).findByCandidateIdOrderByAppliedAtDesc(1L);
    }
}
