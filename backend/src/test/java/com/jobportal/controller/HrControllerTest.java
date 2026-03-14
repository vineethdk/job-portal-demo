package com.jobportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.dto.JobRequest;
import com.jobportal.dto.StatusUpdateRequest;
import com.jobportal.entity.Application;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.enums.Role;
import com.jobportal.exception.GlobalExceptionHandler;
import com.jobportal.service.HrService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HrController.class)
@Import(GlobalExceptionHandler.class)
class HrControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HrService hrService;

    @Autowired
    private ObjectMapper objectMapper;

    private User hrUser;
    private User candidateUser;
    private Job job;

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
        job.setDescription("Looking for Java developer");
        job.setRequiredSkills("Java,Spring");
        job.setMinExperience(2);
        job.setMaxSalary(100000.0);
        job.setLocation("Mumbai");
    }

    @Test
    @DisplayName("POST /api/hr/jobs - 201")
    void createJob_success() throws Exception {
        JobRequest request = new JobRequest();
        request.setTitle("Java Developer");
        request.setDescription("Looking for Java developer");
        request.setRequiredSkills("Java,Spring");
        request.setMinExperience(2);
        request.setMaxSalary(100000.0);
        request.setLocation("Mumbai");
        request.setPostedBy(1L);

        when(hrService.createJob(any(JobRequest.class))).thenReturn(job);

        mockMvc.perform(post("/api/hr/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Java Developer"))
                .andExpect(jsonPath("$.companyName").value("TechCorp"));
    }

    @Test
    @DisplayName("GET /api/hr/jobs/{userId} - 200")
    void getJobsByHr_success() throws Exception {
        when(hrService.getJobsByHr(1L)).thenReturn(List.of(job));

        mockMvc.perform(get("/api/hr/jobs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Java Developer"));
    }

    @Test
    @DisplayName("GET /api/hr/jobs/{jobId}/applications - 200")
    void getApplicationsForJob_success() throws Exception {
        Application app = new Application(candidateUser, job);
        app.setId(1L);

        when(hrService.getApplicationsForJob(1L)).thenReturn(List.of(app));

        mockMvc.perform(get("/api/hr/jobs/1/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].status").value("APPLIED"));
    }

    @Test
    @DisplayName("PUT /api/hr/applications/{appId}/status - 200")
    void updateStatus_success() throws Exception {
        StatusUpdateRequest request = new StatusUpdateRequest();
        request.setStatus("SHORTLISTED");

        Application updatedApp = new Application(candidateUser, job);
        updatedApp.setId(1L);
        updatedApp.setStatus(ApplicationStatus.SHORTLISTED);

        when(hrService.updateApplicationStatus(eq(1L), eq("SHORTLISTED"))).thenReturn(updatedApp);

        mockMvc.perform(put("/api/hr/applications/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SHORTLISTED"));
    }

    @Test
    @DisplayName("GET /api/hr/candidates/search - 200")
    void searchCandidates_success() throws Exception {
        CandidateProfile cp = new CandidateProfile(candidateUser, "Java,Spring", 3, 80000.0, "Mumbai", "Java Dev");
        cp.setId(1L);

        when(hrService.searchCandidates("Java", 2, 100000.0, "Mumbai"))
                .thenReturn(List.of(cp));

        mockMvc.perform(get("/api/hr/candidates/search")
                        .param("skill", "Java")
                        .param("minExperience", "2")
                        .param("maxSalary", "100000.0")
                        .param("location", "Mumbai"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].skills").value("Java,Spring"));
    }
}
