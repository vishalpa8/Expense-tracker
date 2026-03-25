package com.expensetracker.service;

import com.expensetracker.dto.AccountRequest;
import com.expensetracker.entity.Account;
import com.expensetracker.entity.User;
import com.expensetracker.repository.AccountRepository;
import com.expensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public Account createAccount(User user, AccountRequest request) {
        if (accountRepository.existsByUserIdAndAccountNameIgnoreCase(user.getId(), request.getAccountName().trim())) {
            throw new RuntimeException("Account with this name already exists");
        }
        Account account = new Account();
        account.setUser(user);
        account.setAccountName(request.getAccountName().trim());
        account.setAccountNumber(request.getAccountNumber());
        account.setOpeningBalance(request.getOpeningBalance());
        account.setCurrentBalance(request.getOpeningBalance());
        return accountRepository.save(account);
    }

    public List<Account> getUserAccounts(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    @Transactional
    public Account updateAccount(User user, Long accountId, AccountRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        account.setAccountName(request.getAccountName().trim());
        account.setAccountNumber(request.getAccountNumber());
        return accountRepository.save(account);
    }

    @Transactional
    public void deleteAccount(User user, Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        if (transactionRepository.existsByAccountId(accountId)) {
            throw new RuntimeException("Cannot delete account with existing transactions");
        }
        accountRepository.delete(account);
    }
}
