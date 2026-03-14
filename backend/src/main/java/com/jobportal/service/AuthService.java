package com.jobportal.service;

import com.jobportal.dto.LoginRequest;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.entity.User;
import com.jobportal.enums.Role;
import com.jobportal.exception.BadRequestException;
import com.jobportal.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role. Must be CANDIDATE or HR_ADMIN");
        }

        if (role == Role.HR_ADMIN && (request.getCompanyName() == null || request.getCompanyName().isBlank())) {
            throw new BadRequestException("Company name is required for HR_ADMIN role");
        }

        User user = new User(
                request.getUsername(),
                request.getPassword(),
                role,
                request.getFullName(),
                request.getCompanyName()
        );

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        return user;
    }
}
