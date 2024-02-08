package main.java.elementalmp4.microbot.handler;

import main.java.elementalmp4.microbot.entity.Session;
import org.json.JSONObject;

public abstract class AbstractHandler {

    public abstract void execute(Session session, JSONObject data);
    public abstract String name();

}
