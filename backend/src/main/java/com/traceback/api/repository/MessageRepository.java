package com.traceback.api.repository;

import com.traceback.api.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.timestamp ASC")
    List<Message> findByConversationIdOrderByTimestampAsc(@Param("conversationId") Long conversationId);
}
