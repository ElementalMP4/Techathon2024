package main.java.elementalmp4.microbot.handler;

import main.java.elementalmp4.microbot.entity.Session;
import main.java.elementalmp4.microbot.service.SessionService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.logging.Logger;

import static main.java.elementalmp4.microbot.entity.MessageBuilder.error;
import static main.java.elementalmp4.microbot.entity.MessageBuilder.success;

@Handler
public class IdentifyHandler extends AbstractHandler {

    @Autowired
    private SessionService sessionService;

    private static final Logger LOGGER = Logger.getLogger(IdentifyHandler.class.getName());

    @Override
    public void execute(Session session, JSONObject data) {
        if (data.getString("nodeType").equals("command")) {
            if (sessionService.getCommandNodeSession().isPresent()) {
                session.send(error(this.name(), "Command node has already been registered"));
                return;
            }
            LOGGER.info("Identified command node as " + session.getSessionId());
            session.setSessionType("command");
        }

        session.send(success(this.name(), "Identified"));
    }

    @Override
    public String name() {
        return "identify";
    }
}
