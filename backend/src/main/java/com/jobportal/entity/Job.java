package com.jobportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "posted_by", nullable = false)
    private User postedBy;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String requiredSkills;

    private int minExperience;

    private double maxSalary;

    private String location;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Job() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getPostedBy() { return postedBy; }
    public void setPostedBy(User postedBy) { this.postedBy = postedBy; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
