package main.java.elementalmp4.micronet.handler;

import main.java.elementalmp4.micronet.entity.Session;
import org.json.JSONObject;

import java.util.Set;

import static main.java.elementalmp4.micronet.entity.MessageBuilder.error;
import static main.java.elementalmp4.micronet.entity.MessageBuilder.success;

@Handler
public class IdentifyHandler extends AbstractHandler {

    private static final Set<String> VALID_TYPES = Set.of("client", "bridge");

    @Override
    public void execute(Session session, JSONObject data) {
        String type = data.getString("nodeType");
        String sessionGroup = data.getString("group");

        if (!VALID_TYPES.contains(type)) {
            session.send(error(name(), "Invalid session type"));
            return;
        }

        session.setSessionType(type);
        session.setSessionGroup(sessionGroup);

        session.send(success(name(), "Identified as " + type + " in group " + sessionGroup));
    }

    @Override
    public String name() {
        return "identify";
    }
}
