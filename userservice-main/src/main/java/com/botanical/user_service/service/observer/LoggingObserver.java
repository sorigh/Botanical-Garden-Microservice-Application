package com.botanical.user_service.service.observer;

import com.botanical.user_service.domain.Observer;
import com.botanical.user_service.domain.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LoggingObserver implements Observer {

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    @Override
    public void update(Object data) {
        if (!(data instanceof User user)) {
            return;
        }

        String emailRecipient = user.getEmail();
        String smsRecipient = user.getPhoneNumber();

        String emailSubject = "Notification from Botanical Garden System";
        String emailBody = "Hello " + user.getUsername() + ", a login was detected in your account.";

        String smsMessage = "Hi+" + user.getUsername() + ",+you+just+logged+in.";

        try {
            if (emailRecipient != null && !emailRecipient.isBlank() && isValidEmail(emailRecipient)) {
                emailService.sendEmail(emailRecipient, emailSubject, emailBody);
            } else {
                System.err.println("Invalid email: " + emailRecipient);
            }
        } catch (Exception e) {
            System.err.println("Failed to send email to " + emailRecipient + ": " + e.getMessage());
        }

        try {
            if (smsRecipient != null && !smsRecipient.isBlank() && isValidPhoneNumber(smsRecipient)) {
                smsService.sendSms(smsRecipient, smsMessage);
            } else {
                System.err.println("Invalid phone number: " + smsRecipient);
            }
        } catch (Exception e) {
            System.err.println("Failed to send SMS to " + smsRecipient + ": " + e.getMessage());
        }
    }

    // Simple regex email validation example
    private boolean isValidEmail(String email) {
        return email.matches("^[\\w-.]+@[\\w-]+\\.[a-z]{2,}$");
    }

    // Simple phone number validation example (adjust pattern to your country/requirements)
    private boolean isValidPhoneNumber(String phone) {
        return phone.matches("^\\+?[0-9]{7,15}$");
    }

}

