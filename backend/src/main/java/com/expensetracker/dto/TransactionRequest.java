package com.expensetracker.dto;

import com.expensetracker.entity.Transaction;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionRequest {
    @NotNull private Long accountId;
    @NotNull private Transaction.TransactionType type;
    @NotNull @Positive @DecimalMax(value = "99999999.99", message = "Amount cannot exceed ₹99,999,999.99")
    @Digits(integer = 8, fraction = 2, message = "Amount must have at most 2 decimal places")
    private BigDecimal amount;
    @NotNull private LocalDateTime transactionDate;
    @Size(max = 100) private String category;
    @Size(max = 500) private String description;
    @Size(max = 200) private String senderReceiver;
    @NotNull private Transaction.PaymentMethod paymentMethod;
    @Size(max = 200) private String paymentDetails;
}
