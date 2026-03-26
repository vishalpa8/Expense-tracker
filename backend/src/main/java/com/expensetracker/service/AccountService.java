package com.expensetracker.service;

import com.expensetracker.dto.AccountRequest;
import com.expensetracker.dto.AccountUpdateRequest;
import com.expensetracker.entity.Account;
import com.expensetracker.entity.User;
import com.expensetracker.exception.AccessDeniedException;
import com.expensetracker.exception.BusinessRuleException;
import com.expensetracker.exception.DuplicateResourceException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.AccountRepository;
import com.expensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public Account createAccount(User user, AccountRequest request) {
        String name = request.getAccountName().trim();
        if (name.isEmpty()) {
            throw new BusinessRuleException("Account name cannot be blank");
        }
        if (accountRepository.existsByUserIdAndAccountNameIgnoreCase(user.getId(), name)) {
            throw new DuplicateResourceException("Account with this name already exists");
        }
        Account account = new Account();
        account.setUser(user);
        account.setAccountName(name);
        account.setAccountNumber(request.getAccountNumber());
        account.setOpeningBalance(request.getOpeningBalance());
        account.setCurrentBalance(request.getOpeningBalance());
        return accountRepository.save(account);
    }

    public List<Account> getUserAccounts(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    @Transactional
    public Account updateAccount(User user, Long accountId, AccountUpdateRequest request) {
        Account account = getOwnedAccount(user, accountId);
        String newName = request.getAccountName().trim();
        if (!account.getAccountName().equalsIgnoreCase(newName)
                && accountRepository.existsByUserIdAndAccountNameIgnoreCase(user.getId(), newName)) {
            throw new DuplicateResourceException("Account with this name already exists");
        }
        account.setAccountName(newName);
        account.setAccountNumber(request.getAccountNumber());
        return accountRepository.save(account);
    }

    @Transactional
    public void deleteAccount(User user, Long accountId) {
        Account account = getOwnedAccount(user, accountId);
        if (transactionRepository.existsByAccountId(accountId)) {
            throw new BusinessRuleException("Cannot delete account with existing transactions");
        }
        accountRepository.delete(account);
    }

    public Map<Long, Map<String, Object>> getBalancesAt(Long userId, LocalDateTime asOf) {
        List<Account> accounts = accountRepository.findByUserId(userId);
        Map<Long, Map<String, Object>> result = new HashMap<>();
        for (Account account : accounts) {
            BigDecimal netUntil = transactionRepository.calculateNetAmountUntil(account.getId(), asOf);
            BigDecimal balanceAtDate = account.getOpeningBalance().add(netUntil);
            Map<String, Object> entry = new HashMap<>();
            entry.put("balance", balanceAtDate);
            result.put(account.getId(), entry);
        }
        return result;
    }

    private Account getOwnedAccount(User user, Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        if (!account.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException();
        }
        return account;
    }
}
