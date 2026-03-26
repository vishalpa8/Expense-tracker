package com.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank @Size(max = 30) private String username;
    @NotBlank @Size(max = 100) private String password;
}
