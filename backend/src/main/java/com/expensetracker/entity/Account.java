package com.expensetracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Version
    private Long version;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String accountName;
    
    private String accountNumber;
    
    @Column(nullable = false)
    private BigDecimal openingBalance = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private BigDecimal currentBalance = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
