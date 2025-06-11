package com.botanical.specimen_service.service.observer;


import com.botanical.specimen_service.domain.Observable;
import com.botanical.specimen_service.domain.Observer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LoggingObserver implements Observer {
    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    @Override
    public void update(Observable observable) {
        System.out.println("PlantService a suferit o modificare. Notificare trimisă...");
        // Example hardcoded recipient data (in real case get from context or config)
        String emailRecipient = "sorana.ghiorghe@gmail.com";
        String emailSubject = "Notification from Botanical Garden System";
        String emailBody = "A new update was registered in your specimen database. Please review it on the dashboard.";

        String smsRecipient = "40733764524";
        String smsMessage = "Someone+deleted+a+specimen!";

        emailService.sendEmail(emailRecipient, emailSubject, emailBody);
        smsService.sendSms(smsRecipient, smsMessage);

    }

}
