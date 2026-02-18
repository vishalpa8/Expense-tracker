package com.expensetracker.repository;

import com.expensetracker.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountIdOrderByTransactionDateDesc(Long accountId);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.user.id = :userId AND t.transactionDate BETWEEN :start AND :end ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserIdAndDateRange(Long userId, LocalDateTime start, LocalDateTime end);
}
