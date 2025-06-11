package com.botanical.plant_service.service.observer;

import com.botanical.plant_service.domain.Observable;
import com.botanical.plant_service.domain.Observer;
import com.botanical.plant_service.service.EmailService;
import com.botanical.plant_service.service.SmsService;
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
        String emailBody = "A new update was registered in your plant database. Please review it on the dashboard.";

        String smsRecipient = "40733764524";
        String smsMessage = "PlantService+update+occurred!";

        //emailService.sendEmail(emailRecipient, emailSubject, emailBody);
        smsService.sendSms(smsRecipient, smsMessage);

    }
}
