package main.java.elementalmp4.micronet.handler;

import main.java.elementalmp4.micronet.entity.Session;
import org.json.JSONObject;

public abstract class AbstractHandler {

    public abstract void execute(Session session, JSONObject data);
    public abstract String name();

}
