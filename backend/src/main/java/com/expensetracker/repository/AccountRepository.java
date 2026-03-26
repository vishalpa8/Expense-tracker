package com.expensetracker.repository;

import com.expensetracker.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUserId(Long userId);
    void deleteAllByUserId(Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndAccountNameIgnoreCase(Long userId, String accountName);
}
