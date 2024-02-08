package main.java.elementalmp4.microbot.entity;

import org.json.JSONObject;

public class MessageBuilder {

    public static JSONObject error(String type, Exception e) {
        return error(type, e.getMessage());
    }

    public static JSONObject error(String type, String error) {
        return new JSONObject().put("success", false).put("type", type).put("data", new JSONObject().put("error", error));
    }

    public static JSONObject success(String type, String message) {
        return success(type, new JSONObject().put("message", message));
    }

    public static JSONObject success(String type, JSONObject payload) {
        return new JSONObject().put("success", true).put("type", type).put("data", payload);
    }

}