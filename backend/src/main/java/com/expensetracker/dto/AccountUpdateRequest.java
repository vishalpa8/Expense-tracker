package com.expensetracker.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AccountUpdateRequest {
    @NotBlank @Size(max = 100, message = "Account name must be at most 100 characters")
    private String accountName;

    @Size(max = 50, message = "Account number must be at most 50 characters")
    private String accountNumber;

    private LocalDateTime createdAt;

    @PositiveOrZero
    @DecimalMax(value = "99999999.99", message = "Balance cannot exceed ₹99,999,999.99")
    @Digits(integer = 8, fraction = 2, message = "Balance must have at most 2 decimal places")
    private BigDecimal openingBalance;
}
