package com.traceback.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.traceback.api.dto.AuthRequest;
import com.traceback.api.dto.RegisterRequest;
import com.traceback.api.model.Role;
import com.traceback.api.model.User;
import com.traceback.api.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired(required = false)
    private NotificationRepository notificationRepository;

    @Autowired(required = false)
    private ClaimRepository claimRepository;

    @Autowired(required = false)
    private MessageRepository messageRepository;

    @Autowired(required = false)
    private ConversationRepository conversationRepository;

    @Autowired(required = false)
    private MatchRecordRepository matchRecordRepository;

    @Autowired(required = false)
    private LostReportRepository lostReportRepository;

    @Autowired(required = false)
    private FoundReportRepository foundReportRepository;

    @Autowired(required = false)
    private ItemRepository itemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        if (notificationRepository != null)
            notificationRepository.deleteAll();
        if (claimRepository != null)
            claimRepository.deleteAll();
        if (messageRepository != null)
            messageRepository.deleteAll();
        if (conversationRepository != null)
            conversationRepository.deleteAll();
        if (matchRecordRepository != null)
            matchRecordRepository.deleteAll();
        if (lostReportRepository != null)
            lostReportRepository.deleteAll();
        if (foundReportRepository != null)
            foundReportRepository.deleteAll();
        if (itemRepository != null)
            itemRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testValidRegistrationReturnsSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Alice");
        request.setEmail("alice@vit.edu");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"));
    }

    @Test
    void testDuplicateEmailReturns409() throws Exception {
        User existingUser = new User();
        existingUser.setName("Bob");
        existingUser.setEmail("bob@vit.edu");
        existingUser.setPassword(passwordEncoder.encode("password123"));
        existingUser.setRole(Role.STUDENT);
        userRepository.save(existingUser);

        RegisterRequest request = new RegisterRequest();
        request.setName("Bob2");
        request.setEmail("bob@vit.edu");
        request.setPassword("newpass");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email already in use"));
    }

    @Test
    void testInvalidRegistrationReturns400() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Alice");
        request.setEmail("invalid-email");
        // password missing

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.details").isArray());
    }

    @Test
    void testSuccessfulLoginReturnsJwt() throws Exception {
        User user = new User();
        user.setName("Charlie");
        user.setEmail("charlie@vit.edu");
        user.setPassword(passwordEncoder.encode("secret"));
        user.setRole(Role.STUDENT);
        userRepository.save(user);

        AuthRequest request = new AuthRequest();
        request.setEmail("charlie@vit.edu");
        request.setPassword("secret");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.role").value("STUDENT"));
    }

    @Test
    void testInvalidCredentialsReturns401() throws Exception {
        User user = new User();
        user.setName("Dave");
        user.setEmail("dave@vit.edu");
        user.setPassword(passwordEncoder.encode("secret"));
        user.setRole(Role.STUDENT);
        userRepository.save(user);

        AuthRequest request = new AuthRequest();
        request.setEmail("dave@vit.edu");
        request.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized()); // Spring Security default for bad credentials
    }

    @Test
    void testProtectedEndpointWithoutJwtReturns401() throws Exception {
        mockMvc.perform(get("/api/reports"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testProtectedEndpointWithJwtReturnsSuccess() throws Exception {
        User user = new User();
        user.setName("Eve");
        user.setEmail("eve@vit.edu");
        user.setPassword(passwordEncoder.encode("secret"));
        user.setRole(Role.STUDENT);
        userRepository.save(user);

        AuthRequest request = new AuthRequest();
        request.setEmail("eve@vit.edu");
        request.setPassword("secret");

        String response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(response).get("token").asText();

        mockMvc.perform(get("/api/reports")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void testStudentAttemptingSecurityEndpointReturns403() throws Exception {
        User user = new User();
        user.setName("Frank");
        user.setEmail("frank@vit.edu");
        user.setPassword(passwordEncoder.encode("secret"));
        user.setRole(Role.STUDENT);
        userRepository.save(user);

        AuthRequest request = new AuthRequest();
        request.setEmail("frank@vit.edu");
        request.setPassword("secret");

        String response = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(response).get("token").asText();

        mockMvc.perform(get("/api/claims/pending")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }
}
