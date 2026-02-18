package com.expensetracker.dto;

import com.expensetracker.entity.Transaction;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionRequest {
    private Long accountId;
    private Transaction.TransactionType type;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
    private String category;
    private String description;
    private String senderReceiver;
    private Transaction.PaymentMethod paymentMethod;
    private String paymentDetails;
}
