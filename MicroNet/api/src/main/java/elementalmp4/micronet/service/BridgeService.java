package main.java.elementalmp4.micronet.service;

import main.java.elementalmp4.micronet.entity.Session;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class BridgeService {

    public HashMap<String, Session> channels = new HashMap<>();

    public void addChannels(Session session, List<String> newChannels) {
        for (String channel : newChannels) {
            channels.put(channel, session);
        }
    }

    public void removeSession(String sessionId) {
        HashMap<String, Session> channelCopy = new HashMap<>(channels);
        for (String channel : channelCopy.keySet()) {
            Session s = channelCopy.get(channel);
            if (s.getSessionId().equals(sessionId)) {
                channels.remove(channel);
            }
        }
    }

    public Optional<Session> getSessionForChannel(String channel) {
        return Optional.ofNullable(channels.get(channel));
    }

    public boolean isValidGroup(String sessionGroup) {
        return channels.containsKey(sessionGroup);
    }
}
