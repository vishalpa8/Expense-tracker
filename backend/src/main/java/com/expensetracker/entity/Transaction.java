package com.expensetracker.entity;

import com.expensetracker.security.EncryptedFieldConverter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_txn_account_id", columnList = "account_id"),
    @Index(name = "idx_txn_date", columnList = "transaction_date")
})
@Getter
@Setter
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "user", "version"})
    private Account account;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Convert(converter = EncryptedFieldConverter.class)
    @Column(length = 500)
    private String category;

    @Convert(converter = EncryptedFieldConverter.class)
    @Column(length = 1000)
    private String description;

    @Convert(converter = EncryptedFieldConverter.class)
    @Column(length = 500)
    private String senderReceiver;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Convert(converter = EncryptedFieldConverter.class)
    @Column(length = 500)
    private String paymentDetails;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum TransactionType {
        INCOME, EXPENSE
    }

    public enum PaymentMethod {
        UPI, CARD, CASH, BANK_TRANSFER, OTHER
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Transaction that = (Transaction) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
