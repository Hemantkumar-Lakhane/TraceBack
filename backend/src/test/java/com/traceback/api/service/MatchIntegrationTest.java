package com.traceback.api.service;

import com.traceback.api.model.*;
import com.traceback.api.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
public class MatchIntegrationTest {

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private LostReportRepository lostReportRepository;

    @Autowired
    private FoundReportRepository foundReportRepository;

    @Autowired
    private MatchRecordRepository matchRecordRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    private User student1;
    private User student2;

    @BeforeEach
    void setUp() {
        conversationRepository.deleteAll();
        matchRecordRepository.deleteAll();
        foundReportRepository.deleteAll();
        lostReportRepository.deleteAll();
        itemRepository.deleteAll();
        userRepository.deleteAll();

        student1 = new User();
        student1.setName("Student 1");
        student1.setEmail("student1@test.com");
        student1.setPassword("password");
        student1.setRole(Role.STUDENT);
        userRepository.save(student1);

        student2 = new User();
        student2.setName("Student 2");
        student2.setEmail("student2@test.com");
        student2.setPassword("password");
        student2.setRole(Role.STUDENT);
        userRepository.save(student2);
    }

    @Test
    void testMatchCreationAndConversation() {
        Item lostItem = new Item();
        lostItem.setCategory("Electronics");
        lostItem.setName("Phone");

        LostReport lost = new LostReport();
        lost.setUser(student1);
        lost.setItem(lostItem);
        lost.setLocation("Library");
        lost.setDateLost(LocalDate.now());
        lostReportRepository.saveAndFlush(lost);

        Item foundItem = new Item();
        foundItem.setCategory("Electronics");
        foundItem.setName("Phone");

        FoundReport found = new FoundReport();
        found.setUser(student2);
        found.setItem(foundItem);
        found.setLocation("Library");
        found.setDateFound(LocalDate.now());
        foundReportRepository.saveAndFlush(found);

        matchingService.findMatchesForFoundReport(found);

        List<MatchRecord> matches = matchRecordRepository.findAll();
        assertEquals(1, matches.size());
        
        MatchRecord match = matches.get(0);
        assertEquals(100, match.getScore());
        assertEquals(MatchStatus.ACTIVE, match.getStatus());

        List<Conversation> conversations = conversationRepository.findAll();
        assertEquals(1, conversations.size());
        assertEquals(match.getId(), conversations.get(0).getMatchRecord().getId());
    }

    @Test
    void testDuplicateMatchPrevention() {
        Item lostItem = new Item();
        lostItem.setCategory("Electronics");
        lostItem.setName("Phone");

        LostReport lost = new LostReport();
        lost.setUser(student1);
        lost.setItem(lostItem);
        lost.setLocation("Library");
        lost.setDateLost(LocalDate.now());
        lostReportRepository.saveAndFlush(lost);

        Item foundItem = new Item();
        foundItem.setCategory("Electronics");
        foundItem.setName("Phone");

        FoundReport found = new FoundReport();
        found.setUser(student2);
        found.setItem(foundItem);
        found.setLocation("Library");
        found.setDateFound(LocalDate.now());
        foundReportRepository.saveAndFlush(found);

        // Run matching logic twice
        matchingService.findMatchesForFoundReport(found);
        matchingService.findMatchesForLostReport(lost);

        List<MatchRecord> matches = matchRecordRepository.findAll();
        assertEquals(1, matches.size(), "Should only create one match record");
        
        List<Conversation> conversations = conversationRepository.findAll();
        assertEquals(1, conversations.size(), "Should only create one conversation");
    }
}
