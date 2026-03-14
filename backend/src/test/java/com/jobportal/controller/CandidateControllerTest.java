package com.jobportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.dto.ApplicationRequest;
import com.jobportal.entity.Application;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.enums.Role;
import com.jobportal.exception.GlobalExceptionHandler;
import com.jobportal.service.CandidateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CandidateController.class)
@Import(GlobalExceptionHandler.class)
class CandidateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CandidateService candidateService;

    @Autowired
    private ObjectMapper objectMapper;

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
    }

    @Test
    @DisplayName("GET /api/candidate/profile/{userId} - 200")
    void getProfile_success() throws Exception {
        when(candidateService.getProfile(1L)).thenReturn(profile);

        mockMvc.perform(get("/api/candidate/profile/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills").value("Java,Spring"))
                .andExpect(jsonPath("$.experienceYears").value(3))
                .andExpect(jsonPath("$.location").value("Mumbai"));
    }

    @Test
    @DisplayName("PUT /api/candidate/profile/{userId} - 200")
    void createOrUpdateProfile_success() throws Exception {
        CandidateProfile updatedProfile = new CandidateProfile(candidateUser, "Java,Spring,Docker", 4, 90000.0, "Bangalore", "Senior Java Developer");
        updatedProfile.setId(1L);

        when(candidateService.createOrUpdateProfile(eq(1L), any(CandidateProfile.class)))
                .thenReturn(updatedProfile);

        CandidateProfile requestBody = new CandidateProfile();
        requestBody.setSkills("Java,Spring,Docker");
        requestBody.setExperienceYears(4);
        requestBody.setExpectedSalary(90000.0);
        requestBody.setLocation("Bangalore");
        requestBody.setResumeHeadline("Senior Java Developer");

        mockMvc.perform(put("/api/candidate/profile/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills").value("Java,Spring,Docker"))
                .andExpect(jsonPath("$.experienceYears").value(4));
    }

    @Test
    @DisplayName("POST /api/candidate/apply - 201")
    void apply_success() throws Exception {
        ApplicationRequest request = new ApplicationRequest();
        request.setCandidateId(1L);
        request.setJobId(1L);

        Application application = new Application(candidateUser, job);
        application.setId(1L);

        when(candidateService.applyForJob(any(ApplicationRequest.class))).thenReturn(application);

        mockMvc.perform(post("/api/candidate/apply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("APPLIED"));
    }

    @Test
    @DisplayName("GET /api/candidate/applications/{userId} - 200")
    void getApplications_success() throws Exception {
        Application app1 = new Application(candidateUser, job);
        app1.setId(1L);

        when(candidateService.getApplicationsByUser(1L)).thenReturn(List.of(app1));

        mockMvc.perform(get("/api/candidate/applications/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1));
    }
}
