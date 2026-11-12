package com.traceback.api.dto;

import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;

public class ReportRequest {
    private String category;
    private String name;
    private String description;
    private String color;
    private String brand;
    private String location;
    private LocalDate dateLost;
    private LocalDate dateFound;
    private MultipartFile image;

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getDateLost() { return dateLost; }
    public void setDateLost(LocalDate dateLost) { this.dateLost = dateLost; }
    public void setDate_lost(LocalDate date_lost) { this.dateLost = date_lost; }

    public LocalDate getDateFound() { return dateFound; }
    public void setDateFound(LocalDate dateFound) { this.dateFound = dateFound; }
    public void setDate_found(LocalDate date_found) { this.dateFound = date_found; }

    public MultipartFile getImage() { return image; }
    public void setImage(MultipartFile image) { this.image = image; }
}
