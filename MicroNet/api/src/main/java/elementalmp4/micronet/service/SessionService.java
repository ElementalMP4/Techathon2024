package main.java.elementalmp4.micronet.service;

import main.java.elementalmp4.micronet.entity.Session;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SessionService {

    private final Map<String, Session> sessions = new HashMap<>();

    public Session getSession(String id) {
        return sessions.get(id);
    }

    public void putSession(String id, Session session) {
        sessions.put(id, session);
    }

    public void removeSession(String id) {
        sessions.remove(id);
    }

    public void broadcastToClients(String sessionGroup, JSONObject msg) {
        List<Session> clients = sessions.values()
                .stream()
                .filter(s -> "client".equals(s.getSessionType()))
                .filter(s -> sessionGroup.equals(s.getSessionGroup()))
                .toList();
        for (Session session : clients) {
            session.send(msg);
        }
    }

    public void broadcastToBridges(String sessionGroup, JSONObject msg) {
        List<Session> clients = sessions.values()
                .stream()
                .filter(s -> "bridge".equals(s.getSessionType()))
                .filter(s -> sessionGroup.equals(s.getSessionGroup()))
                .toList();
        for (Session session : clients) {
            session.send(msg);
        }
    }
}
