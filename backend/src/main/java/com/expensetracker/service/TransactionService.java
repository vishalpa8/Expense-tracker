package com.expensetracker.service;

import com.expensetracker.dto.TransactionRequest;
import com.expensetracker.entity.Account;
import com.expensetracker.entity.Transaction;
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
    public Transaction createTransaction(TransactionRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setSenderReceiver(request.getSenderReceiver());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setPaymentDetails(request.getPaymentDetails());
        
        BigDecimal newBalance = account.getCurrentBalance();
        if (request.getType() == Transaction.TransactionType.INCOME) {
            newBalance = newBalance.add(request.getAmount());
        } else {
            newBalance = newBalance.subtract(request.getAmount());
        }
        account.setCurrentBalance(newBalance);
        accountRepository.save(account);
        
        return transactionRepository.save(transaction);
    }
    
    public List<Transaction> getTransactionsByDateRange(Long userId, LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findByUserIdAndDateRange(userId, start, end);
    }
}
