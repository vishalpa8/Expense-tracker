package com.expensetracker.controller;

import com.expensetracker.dto.AccountRequest;
import com.expensetracker.entity.Account;
import com.expensetracker.entity.User;
import com.expensetracker.service.AccountService;
import com.expensetracker.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<Account> createAccount(@Valid @RequestBody AccountRequest request, Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(accountService.createAccount(user, request));
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAccounts(Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(accountService.getUserAccounts(user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable Long id, @Valid @RequestBody AccountRequest request, Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(accountService.updateAccount(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id, Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        accountService.deleteAccount(user, id);
        return ResponseEntity.noContent().build();
    }
}
