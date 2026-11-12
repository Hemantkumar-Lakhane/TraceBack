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
public class ConversationControllerIntegrationTest {

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
    private NotificationRepository notificationRepository;

    @Autowired(required = false)
    private ClaimRepository claimRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private User studentA;
    private User studentB;
    private User outsider;
    private Conversation conversation;
    private String tokenA;
    private String tokenB;
    private String tokenOutsider;

    @BeforeEach
    void setUp() {
        if (notificationRepository != null) notificationRepository.deleteAll();
        if (claimRepository != null) claimRepository.deleteAll();
        messageRepository.deleteAll();
        conversationRepository.deleteAll();
        matchRecordRepository.deleteAll();
        lostReportRepository.deleteAll();
        foundReportRepository.deleteAll();
        itemRepository.deleteAll();
        userRepository.deleteAll();

        studentA = new User();
        studentA.setName("Alice");
        studentA.setEmail("alice@test.edu");
        studentA.setPassword("pwd");
        studentA.setRole(Role.STUDENT);
        studentA = userRepository.save(studentA);

        studentB = new User();
        studentB.setName("Bob");
        studentB.setEmail("bob@test.edu");
        studentB.setPassword("pwd");
        studentB.setRole(Role.STUDENT);
        studentB = userRepository.save(studentB);

        outsider = new User();
        outsider.setName("Outsider");
        outsider.setEmail("outsider@test.edu");
        outsider.setPassword("pwd");
        outsider.setRole(Role.STUDENT);
        outsider = userRepository.save(outsider);

        Item lostItem = new Item();
        lostItem.setCategory("KEYS");
        lostItem.setName("Dorm Key");

        Item foundItem = new Item();
        foundItem.setCategory("KEYS");
        foundItem.setName("Dorm Key");

        LostReport lostReport = new LostReport();
        lostReport.setItem(lostItem);
        lostReport.setUser(studentA);
        lostReport.setLocation("Quad");
        lostReport.setDateLost(LocalDate.now());
        lostReport.setStatus(LostReportStatus.MATCHED);
        lostReport = lostReportRepository.save(lostReport);

        FoundReport foundReport = new FoundReport();
        foundReport.setItem(foundItem);
        foundReport.setUser(studentB);
        foundReport.setLocation("Quad");
        foundReport.setDateFound(LocalDate.now());
        foundReport.setStatus(FoundReportStatus.MATCHED);
        foundReport = foundReportRepository.save(foundReport);

        MatchRecord matchRecord = new MatchRecord();
        matchRecord.setLostReport(lostReport);
        matchRecord.setFoundReport(foundReport);
        matchRecord.setScore(100);
        matchRecord.setStatus(MatchStatus.ACTIVE);
        matchRecord = matchRecordRepository.save(matchRecord);

        conversation = new Conversation();
        conversation.setMatchRecord(matchRecord);
        conversation = conversationRepository.save(conversation);

        tokenA = jwtTokenProvider.generateToken(studentA.getEmail(), studentA.getRole().name());
        tokenB = jwtTokenProvider.generateToken(studentB.getEmail(), studentB.getRole().name());
        tokenOutsider = jwtTokenProvider.generateToken(outsider.getEmail(), outsider.getRole().name());
    }

    @Test
    void testGetConversationsForParticipant() throws Exception {
        mockMvc.perform(get("/api/conversations")
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void testSendMessageAndNotifyReceiver() throws Exception {
        mockMvc.perform(post("/api/conversations/" + conversation.getId() + "/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("content", "Hey Bob, is that my blue dorm key?")))
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.content").value("Hey Bob, is that my blue dorm key?"));

        // Verify receiver (studentB) got a notification in DB
        assert notificationRepository.findByUserIdOrderByCreatedAtDesc(studentB.getId()).size() >= 1;
    }

    @Test
    void testUnauthorizedUserCannotAccessConversation() throws Exception {
        mockMvc.perform(get("/api/conversations/" + conversation.getId() + "/messages")
                .header("Authorization", "Bearer " + tokenOutsider))
                .andExpect(status().isForbidden());
    }
}
