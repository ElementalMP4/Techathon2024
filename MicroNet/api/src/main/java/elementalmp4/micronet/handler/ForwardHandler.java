package main.java.elementalmp4.micronet.handler;

import main.java.elementalmp4.micronet.entity.Session;
import main.java.elementalmp4.micronet.service.SessionService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import static main.java.elementalmp4.micronet.entity.MessageBuilder.error;
import static main.java.elementalmp4.micronet.entity.MessageBuilder.success;

@Handler
public class ForwardHandler extends AbstractHandler {

    @Autowired
    private SessionService sessionService;

    @Override
    public void execute(Session session, JSONObject data) {
        if (session.getSessionType().isEmpty()) {
            session.send(error(name(), "Session type not set"));
            return;
        }

        if (session.getSessionType().get().equals("bridge")) {
            sessionService.broadcastToClients(data.getString("group"), success(name(), data));
        } else if (session.getSessionType().get().equals("client")) {
            data.put("group", session.getSessionGroup().get());
            sessionService.broadcastToBridges(success(name(), data));
        }
    }

    @Override
    public String name() {
        return "forward";
    }
}
