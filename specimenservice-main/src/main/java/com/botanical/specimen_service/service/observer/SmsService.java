package com.botanical.specimen_service.service.observer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class SmsService {

    @Value("${callmebot.api_key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sends a WhatsApp message via CallMeBot API.
     * @param to recipient phone number with country code, no +, e.g. "34644565518"
     * @param messageBody text message to send
     */
    public void sendSms(String to, String messageBody) {
        String url = UriComponentsBuilder.fromHttpUrl("https://api.callmebot.com/whatsapp.php")
                .queryParam("phone", to)
                .queryParam("text", messageBody)
                .queryParam("apikey", apiKey)
                .toUriString();

        String response = restTemplate.getForObject(url, String.class);
        // Optionally, log or handle the response to check if message was sent successfully
        System.out.println("CallMeBot response: " + response);
    }
}
