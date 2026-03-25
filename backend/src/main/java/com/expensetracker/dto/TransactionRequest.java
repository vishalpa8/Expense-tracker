package com.expensetracker.dto;

import com.expensetracker.entity.Transaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionRequest {
    @NotNull private Long accountId;
    @NotNull private Transaction.TransactionType type;
    @NotNull @Positive private BigDecimal amount;
    @NotNull private LocalDateTime transactionDate;
    private String category;
    private String description;
    private String senderReceiver;
    @NotNull private Transaction.PaymentMethod paymentMethod;
    private String paymentDetails;
}
