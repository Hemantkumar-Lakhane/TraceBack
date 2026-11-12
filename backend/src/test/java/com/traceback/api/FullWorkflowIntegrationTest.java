package com.traceback.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.traceback.api.dto.AuthRequest;
import com.traceback.api.dto.RegisterRequest;
import com.traceback.api.model.*;
import com.traceback.api.repository.*;
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
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class FullWorkflowIntegrationTest {

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
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void cleanDatabase() {
        notificationRepository.deleteAll();
        claimRepository.deleteAll();
        messageRepository.deleteAll();
        conversationRepository.deleteAll();
        matchRecordRepository.deleteAll();
        lostReportRepository.deleteAll();
        foundReportRepository.deleteAll();
        itemRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testCompleteCampusLifeCycleE2E() throws Exception {
        // Step 1: Register Student Reporter
        RegisterRequest regAlice = new RegisterRequest();
        regAlice.setName("Alice Reporter");
        regAlice.setEmail("alice.reporter@campus.edu");
        regAlice.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regAlice)))
                .andExpect(status().isOk());

        // Step 2: Register Student Finder
        RegisterRequest regBob = new RegisterRequest();
        regBob.setName("Bob Finder");
        regBob.setEmail("bob.finder@campus.edu");
        regBob.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regBob)))
                .andExpect(status().isOk());

        // Step 3: Create Security Officer & Admin in DB
        User securityOfficer = new User();
        securityOfficer.setName("Officer Marcus");
        securityOfficer.setEmail("officer.marcus@campus.edu");
        securityOfficer.setPassword(passwordEncoder.encode("password123"));
        securityOfficer.setRole(Role.SECURITY);
        userRepository.save(securityOfficer);

        User adminDean = new User();
        adminDean.setName("Dean Sarah");
        adminDean.setEmail("dean.sarah@campus.edu");
        adminDean.setPassword(passwordEncoder.encode("password123"));
        adminDean.setRole(Role.ADMIN);
        userRepository.save(adminDean);

        // Step 4: Login Alice (Reporter)
        AuthRequest loginAlice = new AuthRequest();
        loginAlice.setEmail("alice.reporter@campus.edu");
        loginAlice.setPassword("password123");

        MvcResult aliceLoginRes = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginAlice)))
                .andExpect(status().isOk())
                .andReturn();

        String aliceToken = objectMapper.readTree(aliceLoginRes.getResponse().getContentAsString())
                .get("token").asText();

        // Step 5: Login Bob (Finder)
        AuthRequest loginBob = new AuthRequest();
        loginBob.setEmail("bob.finder@campus.edu");
        loginBob.setPassword("password123");

        MvcResult bobLoginRes = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginBob)))
                .andExpect(status().isOk())
                .andReturn();

        String bobToken = objectMapper.readTree(bobLoginRes.getResponse().getContentAsString())
                .get("token").asText();

        // Step 6: Alice submits a Lost Report
        MockMultipartFile emptyFile = new MockMultipartFile("image", "", "image/jpeg", new byte[0]);

        mockMvc.perform(multipart("/api/reports/lost")
                .file(emptyFile)
                .param("category", "ELECTRONICS")
                .param("name", "Dell XPS 15")
                .param("description", "Silver laptop with stickers")
                .param("color", "Silver")
                .param("brand", "Dell")
                .param("location", "Library 2nd Floor")
                .param("date_lost", LocalDate.now().toString())
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());

        assertEquals(1, lostReportRepository.count());

        // Step 7: Bob submits a matching Found Report (Triggers Matching Engine)
        mockMvc.perform(multipart("/api/reports/found")
                .file(emptyFile)
                .param("category", "ELECTRONICS")
                .param("name", "Dell XPS Laptop")
                .param("description", "Found on library desk")
                .param("color", "Silver")
                .param("brand", "Dell")
                .param("location", "Library 2nd Floor")
                .param("date_found", LocalDate.now().toString())
                .header("Authorization", "Bearer " + bobToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());

        assertEquals(1, foundReportRepository.count());

        // Step 8: Verify Match Record and Conversation automatically created
        assertEquals(1, matchRecordRepository.count());
        MatchRecord match = matchRecordRepository.findAll().get(0);
        assertTrue(match.getScore() >= 70, "Match score must be at least 70");

        assertEquals(1, conversationRepository.count());
        Conversation conversation = conversationRepository.findAll().get(0);

        // Step 9: Alice sends message in Conversation
        mockMvc.perform(post("/api/conversations/" + conversation.getId() + "/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("content", "Thank you Bob! Does it have a Linux sticker?")))
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());

        assertEquals(1, messageRepository.count());

        // Step 10: Alice submits verification Claim for this match
        MvcResult claimRes = mockMvc.perform(multipart("/api/claims")
                .param("match_id", match.getId().toString())
                .param("verification_data", "Serial #XPS-9520-88192 with Linux sticker")
                .param("pickup_date", LocalDate.now().plusDays(1).toString())
                .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isCreated())
                .andReturn();

        Long claimId = objectMapper.readTree(claimRes.getResponse().getContentAsString())
                .get("id").asLong();

        // Step 11: Security Officer logs in & approves Claim
        AuthRequest loginSec = new AuthRequest();
        loginSec.setEmail("officer.marcus@campus.edu");
        loginSec.setPassword("password123");

        MvcResult secLoginRes = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginSec)))
                .andExpect(status().isOk())
                .andReturn();

        String secToken = objectMapper.readTree(secLoginRes.getResponse().getContentAsString())
                .get("token").asText();

        mockMvc.perform(put("/api/claims/" + claimId + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("status", "APPROVED")))
                .header("Authorization", "Bearer " + secToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));

        // Step 12: Admin logs in and checks system telemetry stats
        AuthRequest loginAdmin = new AuthRequest();
        loginAdmin.setEmail("dean.sarah@campus.edu");
        loginAdmin.setPassword("password123");

        MvcResult adminLoginRes = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginAdmin)))
                .andExpect(status().isOk())
                .andReturn();

        String adminToken = objectMapper.readTree(adminLoginRes.getResponse().getContentAsString())
                .get("token").asText();

        mockMvc.perform(get("/api/admin/stats")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").value(4))
                .andExpect(jsonPath("$.totalReports").value(2));
    }
}
