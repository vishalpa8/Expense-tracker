package com.expensetracker.config;

import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User user = new User();
            user.setUsername("admin");
            user.setPassword(passwordEncoder.encode("admin123"));
            user.setFullName("Administrator");
            userRepository.save(user);
            System.out.println("Default user created - username: admin, password: admin123");
        }
    }
}
