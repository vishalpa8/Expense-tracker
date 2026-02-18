package com.expensetracker.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccountRequest {
    private String accountName;
    private String accountNumber;
    private BigDecimal openingBalance;
}
