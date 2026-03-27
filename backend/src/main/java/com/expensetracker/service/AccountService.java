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
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public Account createAccount(User user, AccountRequest request) {
        String name = sanitize(request.getAccountName());
        if (name.isEmpty()) {
            throw new BusinessRuleException("Account name cannot be blank");
        }
        if (accountRepository.existsByUserIdAndAccountNameIgnoreCase(user.getId(), name)) {
            throw new DuplicateResourceException("Account with this name already exists");
        }
        Account account = new Account();
        account.setUser(user);
        account.setAccountName(name);
        account.setAccountNumber(sanitize(request.getAccountNumber()));
        account.setOpeningBalance(request.getOpeningBalance());
        account.setCurrentBalance(request.getOpeningBalance());
        if (request.getCreatedAt() != null) {
            account.setCreatedAt(request.getCreatedAt());
        }
        return accountRepository.save(account);
    }

    @Transactional(readOnly = true)
    public List<Account> getUserAccounts(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    @Transactional
    public Account updateAccount(User user, Long accountId, AccountUpdateRequest request) {
        Account account = getOwnedAccount(user, accountId);
        String newName = sanitize(request.getAccountName());
        if (newName.isEmpty()) {
            throw new BusinessRuleException("Account name cannot be blank");
        }
        if (!account.getAccountName().equalsIgnoreCase(newName)
                && accountRepository.existsByUserIdAndAccountNameIgnoreCase(user.getId(), newName)) {
            throw new DuplicateResourceException("Account with this name already exists");
        }
        account.setAccountName(newName);
        account.setAccountNumber(sanitize(request.getAccountNumber()));

        if (request.getCreatedAt() != null && request.getCreatedAt().isBefore(account.getCreatedAt())) {
            if (request.getOpeningBalance() == null) {
                throw new BusinessRuleException("Opening balance is required when shifting account to an earlier date");
            }
            LocalDateTime oneMonthBack = account.getCreatedAt().minusMonths(1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
            if (request.getCreatedAt().isBefore(oneMonthBack)) {
                throw new BusinessRuleException("Can only extend history by one month at a time");
            }

            List<Map<String, String>> carries = getCarries(account);
            carries.add(Map.of("amount", account.getOpeningBalance().toPlainString(), "from", account.getCreatedAt().toString()));
            setCarries(account, carries);

            account.setCreatedAt(request.getCreatedAt());
            account.setOpeningBalance(request.getOpeningBalance());
            recalculateBalance(account);
        }

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

    @Transactional(readOnly = true)
    public Map<Long, Map<String, Object>> getBalancesAt(Long userId, LocalDateTime asOf) {
        List<Account> accounts = accountRepository.findByUserId(userId);
        Map<Long, Map<String, Object>> result = new HashMap<>();
        for (Account account : accounts) {
            BigDecimal netUntil = transactionRepository.calculateNetAmountUntil(account.getId(), asOf);
            BigDecimal balanceAtDate = account.getOpeningBalance().add(netUntil);
            for (Map<String, String> carry : getCarries(account)) {
                LocalDateTime from = LocalDateTime.parse(carry.get("from"));
                if (!asOf.isBefore(from)) {
                    balanceAtDate = balanceAtDate.add(new BigDecimal(carry.get("amount")));
                }
            }
            result.put(account.getId(), Map.of("balance", balanceAtDate));
        }
        return result;
    }

    private List<Map<String, String>> getCarries(Account account) {
        try {
            if (account.getBalanceCarries() == null || account.getBalanceCarries().isEmpty()) return new ArrayList<>();
            return objectMapper.readValue(account.getBalanceCarries(), new TypeReference<>() {});
        } catch (Exception e) { return new ArrayList<>(); }
    }

    private void setCarries(Account account, List<Map<String, String>> carries) {
        try { account.setBalanceCarries(objectMapper.writeValueAsString(carries)); }
        catch (Exception e) { throw new RuntimeException(e); }
    }

    private BigDecimal totalCarry(Account account) {
        BigDecimal total = BigDecimal.ZERO;
        for (Map<String, String> carry : getCarries(account)) {
            total = total.add(new BigDecimal(carry.get("amount")));
        }
        return total;
    }

    private Account getOwnedAccount(User user, Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        if (!account.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException();
        }
        return account;
    }

    private void recalculateBalance(Account account) {
        BigDecimal netAmount = transactionRepository.calculateNetAmount(account.getId());
        account.setCurrentBalance(account.getOpeningBalance().add(totalCarry(account)).add(netAmount));
    }

    private String sanitize(String input) {
        if (input == null) return null;
        return input.replaceAll("<[^>]*>", "").trim();
    }
}
