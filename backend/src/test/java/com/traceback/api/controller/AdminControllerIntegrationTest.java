package com.traceback.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.traceback.api.model.*;
import com.traceback.api.repository.*;
import com.traceback.api.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Map;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AdminControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private LostReportRepository lostReportRepository;

    @Autowired
    private FoundReportRepository foundReportRepository;

    @Autowired
    private MatchRecordRepository matchRecordRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private User admin;
    private User student;
    private String adminToken;
    private String studentToken;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        claimRepository.deleteAll();
        messageRepository.deleteAll();
        conversationRepository.deleteAll();
        matchRecordRepository.deleteAll();
        lostReportRepository.deleteAll();
        foundReportRepository.deleteAll();
        itemRepository.deleteAll();
        userRepository.deleteAll();

        admin = new User();
        admin.setName("Dean Sarah");
        admin.setEmail("sarah.admin@campus.edu");
        admin.setPassword("encodedpass");
        admin.setRole(Role.ADMIN);
        admin = userRepository.save(admin);

        student = new User();
        student.setName("Student Charlie");
        student.setEmail("charlie@campus.edu");
        student.setPassword("encodedpass");
        student.setRole(Role.STUDENT);
        student = userRepository.save(student);

        adminToken = jwtTokenProvider.generateToken(admin.getEmail(), admin.getRole().name());
        studentToken = jwtTokenProvider.generateToken(student.getEmail(), student.getRole().name());
    }

    @Test
    void testGetAllUsersAsAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThanOrEqualTo(2)));
    }

    @Test
    void testStudentForbiddenFromAdminUsers() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testUpdateUserRoleByAdmin() throws Exception {
        mockMvc.perform(put("/api/admin/users/" + student.getId() + "/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("role", "SECURITY")))
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("SECURITY"));
    }

    @Test
    void testGetPlatformStatsAsAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").exists())
                .andExpect(jsonPath("$.totalReports").exists())
                .andExpect(jsonPath("$.activeMatches").exists());
    }
}
