package com.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AccountUpdateRequest {
    @NotBlank @Size(max = 100, message = "Account name must be at most 100 characters")
    private String accountName;

    @Size(max = 50, message = "Account number must be at most 50 characters")
    private String accountNumber;
}
