package com.expensetracker.repository;

import com.expensetracker.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.account.user.id = :userId AND t.transactionDate BETWEEN :start AND :end ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserIdAndDateRange(Long userId, LocalDateTime start, LocalDateTime end);

    boolean existsByAccountId(Long accountId);

    @Query("SELECT DISTINCT t.category FROM Transaction t WHERE t.account.user.id = :userId AND t.category IS NOT NULL ORDER BY t.category")
    List<String> findDistinctCategoriesByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE -t.amount END), 0) FROM Transaction t WHERE t.account.id = :accountId")
    BigDecimal calculateNetAmount(Long accountId);

    @Query("SELECT COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE -t.amount END), 0) FROM Transaction t WHERE t.account.id = :accountId AND t.transactionDate <= :endDate")
    BigDecimal calculateNetAmountUntil(Long accountId, LocalDateTime endDate);
}
