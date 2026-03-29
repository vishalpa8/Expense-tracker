package com.expensetracker.config;

import com.expensetracker.security.EncryptedFieldConverter;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class EncryptionMigration implements ApplicationRunner {

    private final EntityManager em;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        EncryptedFieldConverter converter = new EncryptedFieldConverter();
        migrate(converter, "users", "id", "full_name");
        migrate(converter, "accounts", "id", "account_name", "account_number");
        migrate(converter, "transactions", "id", "category", "description", "sender_receiver", "payment_details");
    }

    private void migrate(EncryptedFieldConverter converter, String table, String idCol, String... cols) {
        for (String col : cols) {
            @SuppressWarnings("unchecked")
            List<Object[]> rows = em.createNativeQuery(
                    "SELECT " + idCol + ", " + col + " FROM " + table +
                    " WHERE " + col + " IS NOT NULL AND " + col + " NOT LIKE 'ENC:%'")
                    .getResultList();
            for (Object[] row : rows) {
                String encrypted = converter.convertToDatabaseColumn((String) row[1]);
                em.createNativeQuery("UPDATE " + table + " SET " + col + " = :val WHERE " + idCol + " = :id")
                        .setParameter("val", encrypted)
                        .setParameter("id", row[0])
                        .executeUpdate();
            }
            if (!rows.isEmpty()) {
                log.info("Encrypted {} rows in {}.{}", rows.size(), table, col);
            }
        }
    }
}
