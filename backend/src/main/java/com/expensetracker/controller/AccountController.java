package com.expensetracker.controller;

import com.expensetracker.dto.AccountRequest;
import com.expensetracker.dto.AccountUpdateRequest;
import com.expensetracker.entity.Account;
import com.expensetracker.entity.User;
import com.expensetracker.service.AccountService;
import com.expensetracker.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/balances")
    public ResponseEntity<Map<Long, Map<String, Object>>> getBalancesAt(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime asOf,
            Authentication auth) {
        User user = authService.getCurrentUser(auth.getName());
        return ResponseEntity.ok(accountService.getBalancesAt(user.getId(), asOf));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable Long id, @Valid @RequestBody AccountUpdateRequest request, Authentication auth) {
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
