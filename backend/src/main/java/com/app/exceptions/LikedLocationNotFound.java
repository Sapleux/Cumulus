package com.app.exceptions;

public class LikedLocationNotFound extends RuntimeException {
    public LikedLocationNotFound(String errorMessage) {
        super(errorMessage);
    }
}
