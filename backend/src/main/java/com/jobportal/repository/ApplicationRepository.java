package com.jobportal.repository;

import com.jobportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidateIdOrderByAppliedAtDesc(Long candidateId);
    List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);
    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);
}
