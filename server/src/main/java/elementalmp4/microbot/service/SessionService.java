package main.java.elementalmp4.microbot.service;

import main.java.elementalmp4.microbot.entity.Session;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class SessionService {

    private final Map<String, Session> sessions = new HashMap();

    public Session getSession(String id) {
        return sessions.get(id);
    }

    public void putSession(String id, Session session) {
        sessions.put(id, session);
    }

    public void removeSession(String id) {
        sessions.remove(id);
    }

    public Optional<Session> getCommandNodeSession() {
        return sessions.values().stream()
                .filter(Session::isCommandNode)
                .findFirst();
    }
}
