package main.java.elementalmp4.micronet.handler;

import main.java.elementalmp4.micronet.entity.Session;
import main.java.elementalmp4.micronet.service.BridgeService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static main.java.elementalmp4.micronet.entity.MessageBuilder.error;
import static main.java.elementalmp4.micronet.entity.MessageBuilder.success;

@Handler
public class IdentifyHandler extends AbstractHandler {

    @Autowired
    private BridgeService bridgeService;

    private static final Set<String> VALID_TYPES = Set.of("client", "bridge");

    @Override
    public void execute(Session session, JSONObject data) {
        String type = data.getString("nodeType");

        if (!VALID_TYPES.contains(type)) {
            session.send(error(name(), "Invalid session type"));
            return;
        }

        session.setSessionType(type);

        if (type.equals("client")) {
            String sessionGroup = data.getString("group");
            if (!bridgeService.isValidGroup(sessionGroup)) {
                session.send(error(name(), "Invalid channel provided!"));
                return;
            }
            session.setSessionGroup(sessionGroup);
            session.send(success(name(), "Identified as " + type + " in group " + sessionGroup));
        } else if (type.equals("bridge")) {
            List<String> channels = jsonArrayToList(data.getJSONArray("channels"));
            bridgeService.addChannels(session, channels);
            session.send(success(name(), "Identified as " + type));
        }
    }

    private List<String> jsonArrayToList(JSONArray jsonArray) {
        List<String> list = new ArrayList<>();
        for (Object o : jsonArray.toList()) {
            list.add((String) o);
        }
        return list;
    }

    @Override
    public String name() {
        return "identify";
    }
}
