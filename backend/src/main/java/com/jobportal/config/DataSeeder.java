package com.jobportal.config;

import com.jobportal.entity.Application;
import com.jobportal.entity.CandidateProfile;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.enums.Role;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CandidateProfileRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CandidateProfileRepository profileRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public DataSeeder(UserRepository userRepository,
                      CandidateProfileRepository profileRepository,
                      JobRepository jobRepository,
                      ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public void run(String... args) {
        // --- HR Admins ---
        User hr1 = userRepository.save(new User("hr1", "password", Role.HR_ADMIN, "Alice Johnson", "TechCorp"));
        User hr2 = userRepository.save(new User("hr2", "password", Role.HR_ADMIN, "Bob Williams", "DataSoft"));

        // --- Candidates ---
        User c1 = userRepository.save(new User("candidate1", "password", Role.CANDIDATE, "John Doe", null));
        User c2 = userRepository.save(new User("candidate2", "password", Role.CANDIDATE, "Jane Smith", null));
        User c3 = userRepository.save(new User("candidate3", "password", Role.CANDIDATE, "Mike Brown", null));

        // --- Candidate Profiles ---
        profileRepository.save(new CandidateProfile(c1, "Java,Spring Boot,React,SQL", 4, 90000, "New York", "Full Stack Developer with 4 years experience"));
        profileRepository.save(new CandidateProfile(c2, "Python,Django,Machine Learning,AWS", 3, 85000, "San Francisco", "ML Engineer passionate about AI"));
        profileRepository.save(new CandidateProfile(c3, "JavaScript,Node.js,Angular,MongoDB", 2, 70000, "Chicago", "Frontend developer seeking growth opportunities"));

        // --- Jobs (TechCorp) ---
        Job job1 = new Job();
        job1.setPostedBy(hr1);
        job1.setCompanyName("TechCorp");
        job1.setTitle("Senior Java Developer");
        job1.setDescription("Looking for an experienced Java developer to join our backend team. Must have strong Spring Boot skills.");
        job1.setRequiredSkills("Java,Spring Boot,SQL,Microservices");
        job1.setMinExperience(3);
        job1.setMaxSalary(120000);
        job1.setLocation("New York");
        job1 = jobRepository.save(job1);

        Job job2 = new Job();
        job2.setPostedBy(hr1);
        job2.setCompanyName("TechCorp");
        job2.setTitle("React Frontend Developer");
        job2.setDescription("Join our UI team to build modern web applications using React and TypeScript.");
        job2.setRequiredSkills("React,TypeScript,CSS,JavaScript");
        job2.setMinExperience(2);
        job2.setMaxSalary(100000);
        job2.setLocation("New York");
        job2 = jobRepository.save(job2);

        Job job3 = new Job();
        job3.setPostedBy(hr1);
        job3.setCompanyName("TechCorp");
        job3.setTitle("DevOps Engineer");
        job3.setDescription("Manage our cloud infrastructure and CI/CD pipelines.");
        job3.setRequiredSkills("AWS,Docker,Kubernetes,Jenkins");
        job3.setMinExperience(3);
        job3.setMaxSalary(130000);
        job3.setLocation("Remote");
        job3 = jobRepository.save(job3);

        // --- Jobs (DataSoft) ---
        Job job4 = new Job();
        job4.setPostedBy(hr2);
        job4.setCompanyName("DataSoft");
        job4.setTitle("Data Scientist");
        job4.setDescription("Analyze large datasets and build predictive models using Python and ML frameworks.");
        job4.setRequiredSkills("Python,Machine Learning,TensorFlow,SQL");
        job4.setMinExperience(2);
        job4.setMaxSalary(110000);
        job4.setLocation("San Francisco");
        job4 = jobRepository.save(job4);

        Job job5 = new Job();
        job5.setPostedBy(hr2);
        job5.setCompanyName("DataSoft");
        job5.setTitle("Full Stack Developer");
        job5.setDescription("Build end-to-end features for our SaaS platform using Node.js and Angular.");
        job5.setRequiredSkills("Node.js,Angular,MongoDB,TypeScript");
        job5.setMinExperience(1);
        job5.setMaxSalary(95000);
        job5.setLocation("Chicago");
        job5 = jobRepository.save(job5);

        // --- Sample Applications ---
        Application app1 = new Application(c1, job1);
        app1.setStatus(ApplicationStatus.SHORTLISTED);
        applicationRepository.save(app1);

        Application app2 = new Application(c1, job2);
        app2.setStatus(ApplicationStatus.APPLIED);
        applicationRepository.save(app2);

        Application app3 = new Application(c2, job4);
        app3.setStatus(ApplicationStatus.APPLIED);
        applicationRepository.save(app3);

        Application app4 = new Application(c3, job5);
        app4.setStatus(ApplicationStatus.HIRED);
        applicationRepository.save(app4);

        Application app5 = new Application(c2, job1);
        app5.setStatus(ApplicationStatus.REJECTED);
        applicationRepository.save(app5);

        System.out.println("=== Seed data loaded successfully ===");
        System.out.println("HR Admins: hr1/password (TechCorp), hr2/password (DataSoft)");
        System.out.println("Candidates: candidate1/password, candidate2/password, candidate3/password");
        System.out.println("Jobs: 5 jobs across 2 companies");
        System.out.println("Applications: 5 sample applications");
    }
}
