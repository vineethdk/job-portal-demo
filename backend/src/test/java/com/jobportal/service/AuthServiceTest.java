package com.jobportal.service;

import com.jobportal.dto.LoginRequest;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.entity.User;
import com.jobportal.enums.Role;
import com.jobportal.exception.BadRequestException;
import com.jobportal.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest candidateRegisterRequest;
    private RegisterRequest hrRegisterRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        candidateRegisterRequest = new RegisterRequest();
        candidateRegisterRequest.setUsername("testcandidate");
        candidateRegisterRequest.setPassword("password123");
        candidateRegisterRequest.setRole("CANDIDATE");
        candidateRegisterRequest.setFullName("Test Candidate");

        hrRegisterRequest = new RegisterRequest();
        hrRegisterRequest.setUsername("testhr");
        hrRegisterRequest.setPassword("password123");
        hrRegisterRequest.setRole("HR_ADMIN");
        hrRegisterRequest.setFullName("Test HR Admin");
        hrRegisterRequest.setCompanyName("Test Corp");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");
    }

    @Test
    @DisplayName("register: successful candidate registration")
    void register_successfulCandidateRegistration() {
        when(userRepository.existsByUsername("testcandidate")).thenReturn(false);
        User savedUser = new User("testcandidate", "password123", Role.CANDIDATE, "Test Candidate", null);
        savedUser.setId(1L);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = authService.register(candidateRegisterRequest);

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("testcandidate");
        assertThat(result.getRole()).isEqualTo(Role.CANDIDATE);
        assertThat(result.getFullName()).isEqualTo("Test Candidate");
        verify(userRepository).existsByUsername("testcandidate");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register: successful HR admin registration with companyName")
    void register_successfulHrAdminRegistration() {
        when(userRepository.existsByUsername("testhr")).thenReturn(false);
        User savedUser = new User("testhr", "password123", Role.HR_ADMIN, "Test HR Admin", "Test Corp");
        savedUser.setId(2L);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = authService.register(hrRegisterRequest);

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("testhr");
        assertThat(result.getRole()).isEqualTo(Role.HR_ADMIN);
        assertThat(result.getCompanyName()).isEqualTo("Test Corp");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register: fail when username already exists")
    void register_failWhenUsernameExists() {
        when(userRepository.existsByUsername("testcandidate")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(candidateRegisterRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Username already exists");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("register: fail when HR_ADMIN without companyName")
    void register_failWhenHrAdminWithoutCompanyName() {
        hrRegisterRequest.setCompanyName(null);
        when(userRepository.existsByUsername("testhr")).thenReturn(false);

        assertThatThrownBy(() -> authService.register(hrRegisterRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Company name is required for HR_ADMIN role");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("login: successful login")
    void login_successful() {
        User user = new User("testuser", "password123", Role.CANDIDATE, "Test User", null);
        user.setId(1L);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        User result = authService.login(loginRequest);

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("testuser");
        verify(userRepository).findByUsername("testuser");
    }

    @Test
    @DisplayName("login: fail with wrong password")
    void login_failWithWrongPassword() {
        User user = new User("testuser", "correctpassword", Role.CANDIDATE, "Test User", null);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Invalid username or password");
    }

    @Test
    @DisplayName("login: fail with non-existent username")
    void login_failWithNonExistentUsername() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Invalid username or password");
    }
}
