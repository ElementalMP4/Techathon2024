package main.java.elementalmp4.micronet.service;

import main.java.elementalmp4.micronet.entity.Session;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static main.java.elementalmp4.micronet.entity.MessageBuilder.error;

@Service
public class SessionService {

    @Autowired
    private BridgeService bridgeService;

    private final Map<String, Session> sessions = new HashMap<>();

    public Session getSession(String id) {
        return sessions.get(id);
    }

    public void putSession(String id, Session session) {
        sessions.put(id, session);
    }

    public void removeSession(String id) {
        bridgeService.removeSession(id);
        sessions.remove(id);
    }

    public void broadcastToClients(String sessionGroup, JSONObject msg) {
        List<Session> clients = sessions.values()
                .stream()
                .filter(s -> s.getSessionType().isPresent())
                .filter(s -> "client".equals(s.getSessionType().get()))
                .filter(s -> sessionGroup.equals(s.getSessionGroup().get()))
                .toList();
        for (Session session : clients) {
            session.send(msg);
        }
    }

    public void broadcastToBridge(Session session, JSONObject msg) {
        Optional<Session> bridge = bridgeService.getSessionForChannel(session.getSessionGroup().get());
        if (bridge.isPresent()) {
            bridge.get().send(msg);
        } else {
            session.send(error("system", "Group " + session.getSessionGroup().get() + " is no longer available"));
        }
    }
}
