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
class HrServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private CandidateProfileRepository candidateProfileRepository;

    @InjectMocks
    private HrService hrService;

    private User hrUser;
    private User candidateUser;
    private Job job;
    private JobRequest jobRequest;

    @BeforeEach
    void setUp() {
        hrUser = new User("hr1", "password", Role.HR_ADMIN, "HR Admin", "TechCorp");
        hrUser.setId(1L);

        candidateUser = new User("candidate1", "password", Role.CANDIDATE, "Candidate One", null);
        candidateUser.setId(2L);

        job = new Job();
        job.setId(1L);
        job.setPostedBy(hrUser);
        job.setCompanyName("TechCorp");
        job.setTitle("Java Developer");
        job.setDescription("Looking for a Java developer");
        job.setRequiredSkills("Java,Spring");
        job.setMinExperience(2);
        job.setMaxSalary(100000.0);
        job.setLocation("Mumbai");

        jobRequest = new JobRequest();
        jobRequest.setTitle("Java Developer");
        jobRequest.setDescription("Looking for a Java developer");
        jobRequest.setRequiredSkills("Java,Spring");
        jobRequest.setMinExperience(2);
        jobRequest.setMaxSalary(100000.0);
        jobRequest.setLocation("Mumbai");
        jobRequest.setPostedBy(1L);
    }

    @Test
    @DisplayName("createJob: successful job creation by HR_ADMIN")
    void createJob_successfulByHrAdmin() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(hrUser));
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        Job result = hrService.createJob(jobRequest);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Java Developer");
        assertThat(result.getCompanyName()).isEqualTo("TechCorp");
        assertThat(result.getPostedBy().getUsername()).isEqualTo("hr1");
        verify(jobRepository).save(any(Job.class));
    }

    @Test
    @DisplayName("createJob: fails when user is not HR_ADMIN")
    void createJob_failsWhenNotHrAdmin() {
        jobRequest.setPostedBy(2L);
        when(userRepository.findById(2L)).thenReturn(Optional.of(candidateUser));

        assertThatThrownBy(() -> hrService.createJob(jobRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Only HR admins can post jobs");

        verify(jobRepository, never()).save(any(Job.class));
    }

    @Test
    @DisplayName("getJobsByHr: returns jobs list")
    void getJobsByHr_returnsJobsList() {
        Job job2 = new Job();
        job2.setId(2L);
        job2.setTitle("Python Developer");

        when(userRepository.findById(1L)).thenReturn(Optional.of(hrUser));
        when(jobRepository.findByPostedByIdOrderByCreatedAtDesc(1L))
                .thenReturn(Arrays.asList(job, job2));

        List<Job> result = hrService.getJobsByHr(1L);

        assertThat(result).hasSize(2);
        verify(jobRepository).findByPostedByIdOrderByCreatedAtDesc(1L);
    }

    @Test
    @DisplayName("getApplicationsForJob: returns applications")
    void getApplicationsForJob_returnsApplications() {
        Application app = new Application(candidateUser, job);
        app.setId(1L);

        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));
        when(applicationRepository.findByJobIdOrderByAppliedAtDesc(1L))
                .thenReturn(List.of(app));

        List<Application> result = hrService.getApplicationsForJob(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCandidate().getUsername()).isEqualTo("candidate1");
        verify(applicationRepository).findByJobIdOrderByAppliedAtDesc(1L);
    }

    @Test
    @DisplayName("updateApplicationStatus: successful status update")
    void updateApplicationStatus_successful() {
        Application app = new Application(candidateUser, job);
        app.setId(1L);

        Application updatedApp = new Application(candidateUser, job);
        updatedApp.setId(1L);
        updatedApp.setStatus(ApplicationStatus.SHORTLISTED);

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(app));
        when(applicationRepository.save(any(Application.class))).thenReturn(updatedApp);

        Application result = hrService.updateApplicationStatus(1L, "SHORTLISTED");

        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(ApplicationStatus.SHORTLISTED);
        verify(applicationRepository).save(any(Application.class));
    }

    @Test
    @DisplayName("updateApplicationStatus: throws ResourceNotFoundException for non-existent application")
    void updateApplicationStatus_throwsForNonExistent() {
        when(applicationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> hrService.updateApplicationStatus(99L, "SHORTLISTED"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Application not found with id: 99");
    }

    @Test
    @DisplayName("searchCandidates: delegates to repository")
    void searchCandidates_delegatesToRepository() {
        CandidateProfile cp = new CandidateProfile(candidateUser, "Java", 3, 80000.0, "Mumbai", "Java Dev");
        cp.setId(1L);

        when(candidateProfileRepository.searchCandidates("Java", 2, 100000.0, "Mumbai"))
                .thenReturn(List.of(cp));

        List<CandidateProfile> result = hrService.searchCandidates("Java", 2, 100000.0, "Mumbai");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getSkills()).isEqualTo("Java");
        verify(candidateProfileRepository).searchCandidates("Java", 2, 100000.0, "Mumbai");
    }
}
