package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class JobRequest {

    @NotBlank
    private String title;

    private String description;

    private String requiredSkills;

    private int minExperience;

    private double maxSalary;

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
