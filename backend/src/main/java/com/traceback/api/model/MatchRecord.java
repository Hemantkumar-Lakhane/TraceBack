package com.traceback.api.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"lost_id", "found_id"})
})
public class MatchRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lost_id", nullable = false)
    private LostReport lostReport;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "found_id", nullable = false)
    private FoundReport foundReport;

    @Column(nullable = false)
    private Integer score;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus status = MatchStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LostReport getLostReport() { return lostReport; }
    public void setLostReport(LostReport lostReport) { this.lostReport = lostReport; }

    public FoundReport getFoundReport() { return foundReport; }
    public void setFoundReport(FoundReport foundReport) { this.foundReport = foundReport; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
