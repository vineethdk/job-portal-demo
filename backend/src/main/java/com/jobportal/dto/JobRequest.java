package com.jobportal.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class JobRequest {

    @NotBlank
    @Size(min = 2, max = 100, message = "Job title must be between 2 and 100 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotBlank(message = "Required skills are required")
    @Size(max = 500, message = "Skills must not exceed 500 characters")
    private String requiredSkills;

    @Min(value = 0, message = "Minimum experience cannot be negative")
    @Max(value = 50, message = "Minimum experience cannot exceed 50 years")
    private int minExperience;

    @Min(value = 0, message = "Salary cannot be negative")
    @Max(value = 10000000, message = "Salary seems unrealistic")
    private double maxSalary;

    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @NotNull
    private Long postedBy;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public int getMinExperience() { return minExperience; }
    public void setMinExperience(int minExperience) { this.minExperience = minExperience; }

    public double getMaxSalary() { return maxSalary; }
    public void setMaxSalary(double maxSalary) { this.maxSalary = maxSalary; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Long getPostedBy() { return postedBy; }
    public void setPostedBy(Long postedBy) { this.postedBy = postedBy; }
}
