package com.jobportal.service;

import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.enums.Role;
import com.jobportal.repository.JobRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private JobService jobService;

    @Test
    @DisplayName("searchJobs: delegates to repository with all params")
    void searchJobs_delegatesWithAllParams() {
        User hrUser = new User("hr1", "password", Role.HR_ADMIN, "HR Admin", "TechCorp");
        hrUser.setId(1L);

        Job job1 = new Job();
        job1.setId(1L);
        job1.setTitle("Java Developer");
        job1.setPostedBy(hrUser);
        job1.setCompanyName("TechCorp");
        job1.setRequiredSkills("Java,Spring");
        job1.setMinExperience(2);
        job1.setMaxSalary(100000.0);
        job1.setLocation("Mumbai");

        when(jobRepository.searchJobs("Java", 2, 80000.0, "Mumbai"))
                .thenReturn(List.of(job1));

        List<Job> result = jobService.searchJobs("Java", 2, 80000.0, "Mumbai");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Java Developer");
        verify(jobRepository).searchJobs("Java", 2, 80000.0, "Mumbai");
    }

    @Test
    @DisplayName("searchJobs: delegates to repository with null params converted from blank")
    void searchJobs_handlesNullAndBlankParams() {
        when(jobRepository.searchJobs(null, null, null, null))
                .thenReturn(Collections.emptyList());

        List<Job> result = jobService.searchJobs("", null, null, "  ");

        assertThat(result).isEmpty();
        verify(jobRepository).searchJobs(null, null, null, null);
    }
}
