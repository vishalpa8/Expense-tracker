package com.expensetracker.service;

import com.expensetracker.dto.TransactionRequest;
import com.expensetracker.entity.Account;
import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.User;
import com.expensetracker.repository.AccountRepository;
import com.expensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public Transaction createTransaction(User user, TransactionRequest request) {
        Account account = getOwnedAccount(user, request.getAccountId());
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        applyFields(transaction, request);
        Transaction saved = transactionRepository.save(transaction);
        recalculateBalance(account);
        return saved;
    }

    @Transactional
    public Transaction updateTransaction(User user, Long txnId, TransactionRequest request) {
        Transaction existing = transactionRepository.findById(txnId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        Account oldAccount = existing.getAccount();
        if (!oldAccount.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        Account newAccount = request.getAccountId().equals(oldAccount.getId())
                ? oldAccount
                : getOwnedAccount(user, request.getAccountId());

        existing.setAccount(newAccount);
        applyFields(existing, request);
        Transaction saved = transactionRepository.save(existing);

        recalculateBalance(oldAccount);
        if (!newAccount.getId().equals(oldAccount.getId())) {
            recalculateBalance(newAccount);
        }
        return saved;
    }

    @Transactional
    public void deleteTransaction(User user, Long txnId) {
        Transaction transaction = transactionRepository.findById(txnId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        Account account = transaction.getAccount();
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        transactionRepository.delete(transaction);
        recalculateBalance(account);
    }

    public List<Transaction> getTransactionsByDateRange(Long userId, LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findByUserIdAndDateRange(userId, start, end);
    }

    public List<String> getUserCategories(Long userId) {
        return transactionRepository.findDistinctCategoriesByUserId(userId);
    }

    private void recalculateBalance(Account account) {
        BigDecimal balance = account.getOpeningBalance();
        List<Transaction> txns = transactionRepository.findByAccountIdOrderByTransactionDateDesc(account.getId());
        for (Transaction t : txns) {
            if (t.getType() == Transaction.TransactionType.INCOME) {
                balance = balance.add(t.getAmount());
            } else {
                balance = balance.subtract(t.getAmount());
            }
        }
        account.setCurrentBalance(balance);
        accountRepository.save(account);
    }

    private Account getOwnedAccount(User user, Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return account;
    }

    private void applyFields(Transaction t, TransactionRequest r) {
        t.setType(r.getType());
        t.setAmount(r.getAmount());
        t.setTransactionDate(r.getTransactionDate());
        t.setCategory(normalizeCategory(r.getCategory()));
        t.setDescription(r.getDescription());
        t.setSenderReceiver(r.getSenderReceiver());
        t.setPaymentMethod(r.getPaymentMethod());
        t.setPaymentDetails(r.getPaymentDetails());
    }

    private String normalizeCategory(String category) {
        if (category == null || category.isBlank()) return null;
        String trimmed = category.trim();
        return trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1).toLowerCase();
    }
}
