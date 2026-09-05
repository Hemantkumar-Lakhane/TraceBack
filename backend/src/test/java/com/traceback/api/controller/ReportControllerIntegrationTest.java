package com.traceback.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.traceback.api.model.Item;
import com.traceback.api.model.LostReport;
import com.traceback.api.model.Role;
import com.traceback.api.model.User;
import com.traceback.api.repository.FoundReportRepository;
import com.traceback.api.repository.ItemRepository;
import com.traceback.api.repository.LostReportRepository;
import com.traceback.api.repository.UserRepository;
import com.traceback.api.security.JwtTokenProvider;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ReportControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LostReportRepository lostReportRepository;

    @Autowired
    private FoundReportRepository foundReportRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    private String studentToken;
    private String securityToken;
    private User studentUser;

    @BeforeEach
    void setUp() {
        foundReportRepository.deleteAll();
        lostReportRepository.deleteAll();
        itemRepository.deleteAll();
        userRepository.deleteAll();

        studentUser = new User();
        studentUser.setName("Student Test");
        studentUser.setEmail("student@test.com");
        studentUser.setPassword(passwordEncoder.encode("password"));
        studentUser.setRole(Role.STUDENT);
        userRepository.save(studentUser);

        User securityUser = new User();
        securityUser.setName("Security Test");
        securityUser.setEmail("security@test.com");
        securityUser.setPassword(passwordEncoder.encode("password"));
        securityUser.setRole(Role.SECURITY);
        userRepository.save(securityUser);

        org.springframework.security.core.Authentication studentAuth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                new com.traceback.api.security.CustomUserDetails(studentUser), null, java.util.Collections.emptyList());
        studentToken = tokenProvider.generateToken(studentAuth);

        org.springframework.security.core.Authentication securityAuth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                new com.traceback.api.security.CustomUserDetails(securityUser), null, java.util.Collections.emptyList());
        securityToken = tokenProvider.generateToken(securityAuth);
    }

    @AfterEach
    void tearDown() {
        // Clean up uploads directory
        File dir = new File("uploads");
        if (dir.exists()) {
            for (File file : dir.listFiles()) {
                if (!file.isDirectory()) file.delete();
            }
        }
    }

    @Test
    void createLostReport_Success() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
                "image", "test.jpg", "image/jpeg", "dummy image content".getBytes()
        );

        mockMvc.perform(multipart("/api/reports/lost")
                .file(image)
                .param("category", "Electronics")
                .param("name", "Phone")
                .param("description", "Black phone")
                .param("location", "Library")
                .param("dateLost", LocalDate.now().toString())
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.item.category", is("Electronics")))
                .andExpect(jsonPath("$.item.imageUrl", notNullValue()))
                .andExpect(jsonPath("$.location", is("Library")));
                
        // Verify file was saved
        File uploads = new File("uploads");
        assertTrue(uploads.exists() && uploads.list().length > 0);
    }

    @Test
    void createFoundReport_AsSecurity_Success() throws Exception {
        mockMvc.perform(multipart("/api/reports/found")
                .param("category", "Books")
                .param("name", "Math Book")
                .param("location", "Room 101")
                .param("dateFound", LocalDate.now().toString())
                .header("Authorization", "Bearer " + securityToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.item.category", is("Books")));
    }

    @Test
    void createFoundReport_Unauthorized() throws Exception {
        mockMvc.perform(multipart("/api/reports/found")
                .param("category", "Books")
                .param("name", "Math Book"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createLostReport_InvalidImage() throws Exception {
        MockMultipartFile pdf = new MockMultipartFile(
                "image", "test.pdf", "application/pdf", "dummy content".getBytes()
        );

        mockMvc.perform(multipart("/api/reports/lost")
                .file(pdf)
                .param("category", "Books")
                .param("name", "Math Book")
                .param("location", "Room 101")
                .param("dateLost", LocalDate.now().toString())
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getMyReports_ReturnsOnlyCurrentUser() throws Exception {
        // Create lost report
        mockMvc.perform(multipart("/api/reports/lost")
                .param("category", "Electronics")
                .param("name", "Phone")
                .param("location", "Library")
                .param("dateLost", LocalDate.now().toString())
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isCreated());

        // Create found report
        mockMvc.perform(multipart("/api/reports/found")
                .param("category", "Books")
                .param("name", "Math Book")
                .param("location", "Room 101")
                .param("dateFound", LocalDate.now().toString())
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isCreated());

        // Test specific type
        mockMvc.perform(get("/api/reports/my?type=LOST")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].item.name", is("Phone")));
                
        // Test no type (returns both)
        mockMvc.perform(get("/api/reports/my")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        mockMvc.perform(get("/api/reports/my?type=LOST")
                .header("Authorization", "Bearer " + securityToken))
                .andExpect(status().isForbidden());
    }
}
