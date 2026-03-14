package com.jobportal.repository;

import com.jobportal.entity.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByUserId(Long userId);

    @Query("SELECT cp FROM CandidateProfile cp WHERE " +
           "(:skill IS NULL OR LOWER(cp.skills) LIKE LOWER(CONCAT('%', :skill, '%'))) AND " +
           "(:minExperience IS NULL OR cp.experienceYears >= :minExperience) AND " +
           "(:maxSalary IS NULL OR cp.expectedSalary <= :maxSalary) AND " +
           "(:location IS NULL OR LOWER(cp.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<CandidateProfile> searchCandidates(
            @Param("skill") String skill,
            @Param("minExperience") Integer minExperience,
            @Param("maxSalary") Double maxSalary,
            @Param("location") String location
    );
}
