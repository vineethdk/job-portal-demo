package com.jobportal.repository;

import com.jobportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    @Query("SELECT a FROM Application a JOIN FETCH a.candidate c LEFT JOIN FETCH c.candidateProfile JOIN FETCH a.job WHERE a.candidate.id = :candidateId ORDER BY a.appliedAt DESC")
    List<Application> findByCandidateIdOrderByAppliedAtDesc(@Param("candidateId") Long candidateId);

    @Query("SELECT a FROM Application a JOIN FETCH a.candidate c LEFT JOIN FETCH c.candidateProfile JOIN FETCH a.job WHERE a.job.id = :jobId ORDER BY a.appliedAt DESC")
    List<Application> findByJobIdOrderByAppliedAtDesc(@Param("jobId") Long jobId);

    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);
}
