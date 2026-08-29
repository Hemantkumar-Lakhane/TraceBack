package com.traceback.api.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads";

    public FileStorageService() {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null; // Or throw exception if required
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            throw new IllegalArgumentException("Only JPG/JPEG and PNG files are allowed.");
        }

        // We assume file size is limited by Spring configuration (10MB limit)

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.lastIndexOf(".") > 0) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String newFilename = UUID.randomUUID().toString() + extension;
        Path targetLocation = Paths.get(uploadDir).resolve(newFilename);

        try {
            Files.copy(file.getInputStream(), targetLocation);
            return "/uploads/" + newFilename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + newFilename + ". Please try again!", ex);
        }
    }

    public void deleteFile(String relativePath) {
        if (relativePath != null && relativePath.startsWith("/uploads/")) {
            String filename = relativePath.substring("/uploads/".length());
            Path targetLocation = Paths.get(uploadDir).resolve(filename);
            try {
                Files.deleteIfExists(targetLocation);
            } catch (IOException e) {
                // Log the failure to delete, but don't crash
                System.err.println("Failed to delete orphaned file: " + targetLocation);
            }
        }
    }
}
