package sn.finawa.service;

import sn.finawa.entity.UserEntity;

public interface VerificationTokenService {

    void sendVerificationEmail(UserEntity user, String recipientEmail, String recipientName);

    void verifyToken(String token);

    void resendVerificationEmail(String email);
}
