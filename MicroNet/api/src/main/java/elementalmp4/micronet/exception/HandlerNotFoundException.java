package main.java.elementalmp4.micronet.exception;

public class HandlerNotFoundException extends RuntimeException {
    public HandlerNotFoundException(String handler) {
        super("Handler not found for message type " + handler);
    }
}
