package com.expensetracker.service;

import com.expensetracker.dto.AccountRequest;
import com.expensetracker.entity.Account;
import com.expensetracker.entity.User;
import com.expensetracker.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    
    @Transactional
    public Account createAccount(User user, AccountRequest request) {
        Account account = new Account();
        account.setUser(user);
        account.setAccountName(request.getAccountName());
        account.setAccountNumber(request.getAccountNumber());
        account.setOpeningBalance(request.getOpeningBalance());
        account.setCurrentBalance(request.getOpeningBalance());
        return accountRepository.save(account);
    }
    
    public List<Account> getUserAccounts(Long userId) {
        return accountRepository.findByUserId(userId);
    }
}
