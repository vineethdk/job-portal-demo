package com.jobportal.controller;

import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.enums.Role;
import com.jobportal.exception.GlobalExceptionHandler;
import com.jobportal.service.JobService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JobController.class)
@Import(GlobalExceptionHandler.class)
class JobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JobService jobService;

    @Test
    @DisplayName("GET /api/jobs/search - 200 with params")
    void searchJobs_withParams() throws Exception {
        User hrUser = new User("hr1", "password", Role.HR_ADMIN, "HR Admin", "TechCorp");
        hrUser.setId(1L);

        Job job = new Job();
        job.setId(1L);
        job.setPostedBy(hrUser);
        job.setCompanyName("TechCorp");
        job.setTitle("Java Developer");
        job.setRequiredSkills("Java,Spring");
        job.setMinExperience(2);
        job.setMaxSalary(100000.0);
        job.setLocation("Mumbai");

        when(jobService.searchJobs("Java", 2, 80000.0, "Mumbai"))
                .thenReturn(List.of(job));

        mockMvc.perform(get("/api/jobs/search")
                        .param("skill", "Java")
                        .param("minExperience", "2")
                        .param("maxSalary", "80000.0")
                        .param("location", "Mumbai"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Java Developer"))
                .andExpect(jsonPath("$[0].companyName").value("TechCorp"));
    }

    @Test
    @DisplayName("GET /api/jobs/search - 200 without params (defaults to null)")
    void searchJobs_withoutParams() throws Exception {
        when(jobService.searchJobs(null, null, null, null))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/jobs/search"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
