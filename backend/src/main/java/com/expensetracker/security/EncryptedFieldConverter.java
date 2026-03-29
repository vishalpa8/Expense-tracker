package com.expensetracker.security;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.Base64;

@Converter
public class EncryptedFieldConverter implements AttributeConverter<String, String> {

    private static final String ALGO = "AES/GCM/NoPadding";
    private static final int IV_LEN = 12;
    private static final int TAG_LEN = 128;
    private static final String PREFIX = "ENC:";

    private static byte[] getKey() {
        String key = System.getenv("ENCRYPTION_KEY");
        if (key == null || key.length() != 32) {
            throw new IllegalStateException("ENCRYPTION_KEY must be 32 characters");
        }
        return key.getBytes();
    }

    @Override
    public String convertToDatabaseColumn(String value) {
        if (value == null) return null;
        try {
            byte[] iv = new byte[IV_LEN];
            new SecureRandom().nextBytes(iv);
            Cipher cipher = Cipher.getInstance(ALGO);
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(getKey(), "AES"), new GCMParameterSpec(TAG_LEN, iv));
            byte[] encrypted = cipher.doFinal(value.getBytes());
            byte[] combined = ByteBuffer.allocate(IV_LEN + encrypted.length).put(iv).put(encrypted).array();
            return PREFIX + Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String value) {
        if (value == null) return null;
        if (!value.startsWith(PREFIX)) return value; // plaintext fallback for migration
        try {
            byte[] combined = Base64.getDecoder().decode(value.substring(PREFIX.length()));
            ByteBuffer buf = ByteBuffer.wrap(combined);
            byte[] iv = new byte[IV_LEN];
            buf.get(iv);
            byte[] encrypted = new byte[buf.remaining()];
            buf.get(encrypted);
            Cipher cipher = Cipher.getInstance(ALGO);
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(getKey(), "AES"), new GCMParameterSpec(TAG_LEN, iv));
            return new String(cipher.doFinal(encrypted));
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }
}
