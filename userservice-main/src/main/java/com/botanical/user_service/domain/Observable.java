package com.botanical.user_service.domain;

import java.util.ArrayList;
import java.util.List;

public abstract class Observable {
    private final List<Observer> observers = new ArrayList<>();

    public void addObserver(Observer obs) {
        observers.add(obs);
    }

    public void removeObserver(Observer obs) {
        observers.remove(obs);
    }

    public void notifyObservers(Object data) {
        for (Observer observer : observers) {
            System.out.println("Observer" + observer +"gets a notif");
            observer.update(data); // pass data along
        }
    }
}
