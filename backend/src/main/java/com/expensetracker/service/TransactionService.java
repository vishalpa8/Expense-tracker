package com.expensetracker.service;

import com.expensetracker.dto.TransactionRequest;
import com.expensetracker.entity.Account;
import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.User;
import com.expensetracker.exception.AccessDeniedException;
import com.expensetracker.exception.BusinessRuleException;
import com.expensetracker.exception.ResourceNotFoundException;
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
        validateSufficientBalance(account, request.getType(), request.getAmount());
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
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        Account oldAccount = existing.getAccount();
        if (!oldAccount.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException();
        }

        Account newAccount = request.getAccountId().equals(oldAccount.getId())
                ? oldAccount
                : getOwnedAccount(user, request.getAccountId());

        // If moving to a new account or increasing expense, validate balance
        if (request.getType() == Transaction.TransactionType.EXPENSE) {
            BigDecimal currentExpenseContribution = BigDecimal.ZERO;
            if (existing.getType() == Transaction.TransactionType.EXPENSE && existing.getAccount().getId().equals(newAccount.getId())) {
                currentExpenseContribution = existing.getAmount();
            }
            BigDecimal availableBalance = newAccount.getCurrentBalance().add(currentExpenseContribution);
            if (request.getAmount().compareTo(availableBalance) > 0) {
                throw new BusinessRuleException("Insufficient balance. Available: ₹" + availableBalance.toPlainString());
            }
        }

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
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        Account account = transaction.getAccount();
        if (!account.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException();
        }
        // If deleting an income, check that balance won't go negative
        if (transaction.getType() == Transaction.TransactionType.INCOME) {
            BigDecimal balanceAfter = account.getCurrentBalance().subtract(transaction.getAmount());
            if (balanceAfter.compareTo(BigDecimal.ZERO) < 0) {
                throw new BusinessRuleException("Cannot delete this income. Account balance would go negative (₹" + balanceAfter.toPlainString() + ")");
            }
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

    private void validateSufficientBalance(Account account, Transaction.TransactionType type, BigDecimal amount) {
        if (type == Transaction.TransactionType.EXPENSE && amount.compareTo(account.getCurrentBalance()) > 0) {
            throw new BusinessRuleException("Insufficient balance. Available: ₹" + account.getCurrentBalance().toPlainString());
        }
    }

    private void recalculateBalance(Account account) {
        BigDecimal netAmount = transactionRepository.calculateNetAmount(account.getId());
        account.setCurrentBalance(account.getOpeningBalance().add(netAmount));
        accountRepository.save(account);
    }

    private Account getOwnedAccount(User user, Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        if (!account.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException();
        }
        return account;
    }

    private void applyFields(Transaction t, TransactionRequest r) {
        if (r.getTransactionDate().isAfter(LocalDateTime.now())) {
            throw new BusinessRuleException("Transaction date cannot be in the future");
        }
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
        return category.trim();
    }
}
