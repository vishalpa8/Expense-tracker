package com.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccountRequest {
    @NotBlank private String accountName;
    private String accountNumber;
    @NotNull @PositiveOrZero private BigDecimal openingBalance;
}
