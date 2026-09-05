package com.traceback.api.service;

import com.traceback.api.model.FoundReport;
import com.traceback.api.model.Item;
import com.traceback.api.model.LostReport;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @InjectMocks
    private MatchingService matchingService;

    private LostReport lostReport;
    private FoundReport foundReport;
    private Item lostItem;
    private Item foundItem;

    @BeforeEach
    void setUp() {
        lostItem = new Item();
        foundItem = new Item();

        lostReport = new LostReport();
        lostReport.setItem(lostItem);

        foundReport = new FoundReport();
        foundReport.setItem(foundItem);
    }

    @Test
    void calculateScore_CategoryOnly_Returns40() {
        lostItem.setCategory("Electronics");
        foundItem.setCategory("ELECTRONICS ");

        int score = matchingService.calculateScore(lostReport, foundReport);
        assertEquals(40, score);
    }

    @Test
    void calculateScore_LocationOnly_Returns30() {
        lostReport.setLocation("SJT ");
        foundReport.setLocation(" sjt");

        int score = matchingService.calculateScore(lostReport, foundReport);
        assertEquals(30, score);
    }
    
    @Test
    void calculateScore_LocationNotExactMatch_Returns0() {
        lostReport.setLocation("SJT Block");
        foundReport.setLocation("SJT");

        int score = matchingService.calculateScore(lostReport, foundReport);
        assertEquals(0, score); // Strict equality required
    }

    @Test
    void calculateScore_DateOnly_Returns30() {
        lostReport.setDateLost(LocalDate.of(2024, 3, 15));
        foundReport.setDateFound(LocalDate.of(2024, 3, 17));

        int score = matchingService.calculateScore(lostReport, foundReport);
        assertEquals(30, score);
    }

    @Test
    void calculateScore_DateDiffMoreThan2Days_Returns0() {
        lostReport.setDateLost(LocalDate.of(2024, 3, 15));
        foundReport.setDateFound(LocalDate.of(2024, 3, 18));

        int score = matchingService.calculateScore(lostReport, foundReport);
        assertEquals(0, score);
    }

    @Test
    void calculateScore_CategoryAndLocation_Returns70() {
        lostItem.setCategory("Books");
        foundItem.setCategory("Books");
        lostReport.setLocation("Library");
        foundReport.setLocation("Library");

        int score = matchingService.calculateScore(lostReport, foundReport);
        assertEquals(70, score);
    }

    @Test
    void calculateScore_AllCriteria_Returns100() {
        lostItem.setCategory("Keys");
        foundItem.setCategory("keys");
        lostReport.setLocation("Gate 1");
        foundReport.setLocation("Gate 1");
        lostReport.setDateLost(LocalDate.now());
        foundReport.setDateFound(LocalDate.now());

        int score = matchingService.calculateScore(lostReport, foundReport);
        assertEquals(100, score);
    }
}
