package com.traceback.api.dto;

public class ChatMessageDto {
    private String content;
    private Long senderId;

    public ChatMessageDto() {}

    public ChatMessageDto(String content, Long senderId) {
        this.content = content;
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }
}

