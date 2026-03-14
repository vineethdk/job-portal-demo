package com.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "candidate_profile")
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"candidateProfile"})
    private User user;

    private String skills;

    private int experienceYears;

    private double expectedSalary;

    private String location;

    private String resumeHeadline;

    @Lob
    @Column(name = "resume_data")
    @JsonIgnore
    private byte[] resumeData;

    private String resumeFileName;
    private String resumeContentType;

    public CandidateProfile() {}

    public CandidateProfile(User user, String skills, int experienceYears, double expectedSalary, String location, String resumeHeadline) {
        this.user = user;
        this.skills = skills;
        this.experienceYears = experienceYears;
        this.expectedSalary = expectedSalary;
        this.location = location;
        this.resumeHeadline = resumeHeadline;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }

    public double getExpectedSalary() { return expectedSalary; }
    public void setExpectedSalary(double expectedSalary) { this.expectedSalary = expectedSalary; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getResumeHeadline() { return resumeHeadline; }
    public void setResumeHeadline(String resumeHeadline) { this.resumeHeadline = resumeHeadline; }

    public byte[] getResumeData() { return resumeData; }
    public void setResumeData(byte[] resumeData) { this.resumeData = resumeData; }

    public String getResumeFileName() { return resumeFileName; }
    public void setResumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; }

    public String getResumeContentType() { return resumeContentType; }
    public void setResumeContentType(String resumeContentType) { this.resumeContentType = resumeContentType; }

    public boolean isHasResume() {
        return resumeData != null && resumeData.length > 0;
    }
}
