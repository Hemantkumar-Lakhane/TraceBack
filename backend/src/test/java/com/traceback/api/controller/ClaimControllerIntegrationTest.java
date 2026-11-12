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

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ClaimControllerIntegrationTest {

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

    private User student;
    private User security;
    private MatchRecord matchRecord;
    private String studentToken;
    private String securityToken;

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

        student = new User();
        student.setName("Student Alice");
        student.setEmail("alice@campus.edu");
        student.setPassword("encodedpass");
        student.setRole(Role.STUDENT);
        student = userRepository.save(student);

        User finder = new User();
        finder.setName("Finder Bob");
        finder.setEmail("bob@campus.edu");
        finder.setPassword("encodedpass");
        finder.setRole(Role.STUDENT);
        finder = userRepository.save(finder);

        security = new User();
        security.setName("Officer Marcus");
        security.setEmail("marcus@campus.edu");
        security.setPassword("encodedpass");
        security.setRole(Role.SECURITY);
        security = userRepository.save(security);

        Item lostItem = new Item();
        lostItem.setCategory("ELECTRONICS");
        lostItem.setName("MacBook Pro");

        Item foundItem = new Item();
        foundItem.setCategory("ELECTRONICS");
        foundItem.setName("MacBook Pro");

        LostReport lostReport = new LostReport();
        lostReport.setItem(lostItem);
        lostReport.setUser(student);
        lostReport.setLocation("Library");
        lostReport.setDateLost(LocalDate.now());
        lostReport.setStatus(LostReportStatus.MATCHED);
        lostReport = lostReportRepository.save(lostReport);

        FoundReport foundReport = new FoundReport();
        foundReport.setItem(foundItem);
        foundReport.setUser(finder);
        foundReport.setLocation("Library");
        foundReport.setDateFound(LocalDate.now());
        foundReport.setStatus(FoundReportStatus.MATCHED);
        foundReport = foundReportRepository.save(foundReport);

        matchRecord = new MatchRecord();
        matchRecord.setLostReport(lostReport);
        matchRecord.setFoundReport(foundReport);
        matchRecord.setScore(100);
        matchRecord.setStatus(MatchStatus.ACTIVE);
        matchRecord = matchRecordRepository.save(matchRecord);

        studentToken = jwtTokenProvider.generateToken(student.getEmail(), student.getRole().name());
        securityToken = jwtTokenProvider.generateToken(security.getEmail(), security.getRole().name());
    }

    @Test
    void testSubmitClaimSuccess() throws Exception {
        mockMvc.perform(multipart("/api/claims")
                .param("match_id", matchRecord.getId().toString())
                .param("verification_data", "Serial #C02G876XMD6R, React sticker")
                .param("pickup_date", LocalDate.now().plusDays(1).toString())
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.verificationData").value("Serial #C02G876XMD6R, React sticker"));
    }

    @Test
    void testGetPendingClaimsAsSecurity() throws Exception {
        Claim claim = new Claim();
        claim.setMatchRecord(matchRecord);
        claim.setClaimant(student);
        claim.setVerificationData("Serial #12345");
        claim.setStatus(ClaimStatus.PENDING);
        claimRepository.save(claim);

        mockMvc.perform(get("/api/claims/pending")
                .header("Authorization", "Bearer " + securityToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void testStudentForbiddenFromAccessingPendingClaims() throws Exception {
        mockMvc.perform(get("/api/claims/pending")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testSecurityApproveClaim() throws Exception {
        Claim claim = new Claim();
        claim.setMatchRecord(matchRecord);
        claim.setClaimant(student);
        claim.setVerificationData("Serial #12345");
        claim.setStatus(ClaimStatus.PENDING);
        claim = claimRepository.save(claim);

        mockMvc.perform(put("/api/claims/" + claim.getId() + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("status", "APPROVED")))
                .header("Authorization", "Bearer " + securityToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    void testStudentForbiddenFromApprovingClaim() throws Exception {
        Claim claim = new Claim();
        claim.setMatchRecord(matchRecord);
        claim.setClaimant(student);
        claim.setVerificationData("Serial #12345");
        claim.setStatus(ClaimStatus.PENDING);
        claim = claimRepository.save(claim);

        mockMvc.perform(put("/api/claims/" + claim.getId() + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("status", "APPROVED")))
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }
}
