package com.jobportal.repository;

import com.jobportal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByPostedByIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT j FROM Job j WHERE " +
           "(:skill IS NULL OR LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :skill, '%'))) AND " +
           "(:minExperience IS NULL OR j.minExperience <= :minExperience) AND " +
           "(:maxSalary IS NULL OR j.maxSalary >= :maxSalary) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))" +
           " ORDER BY j.createdAt DESC")
    List<Job> searchJobs(
            @Param("skill") String skill,
            @Param("minExperience") Integer minExperience,
            @Param("maxSalary") Double maxSalary,
            @Param("location") String location
    );
}
