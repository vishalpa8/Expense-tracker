package com.expensetracker.dto;

import com.expensetracker.entity.Transaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionRequest {
    @NotNull private Long accountId;
    @NotNull private Transaction.TransactionType type;
    @NotNull @Positive private BigDecimal amount;
    @NotNull private LocalDateTime transactionDate;
    @Size(max = 100) private String category;
    @Size(max = 500) private String description;
    @Size(max = 200) private String senderReceiver;
    @NotNull private Transaction.PaymentMethod paymentMethod;
    @Size(max = 200) private String paymentDetails;
}
