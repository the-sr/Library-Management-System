package library.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomException extends RuntimeException {

    private final int statusCode;
    private final ErrorMessage errorMessage;

    public CustomException(String message) {
        super(message);
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR.value();
        errorMessage = ErrorMessage.builder()
                .error(message)
                .build();
    }

    public CustomException(String message, HttpStatus httpStatus) {
        super(message);
        statusCode = httpStatus.value();
        errorMessage = ErrorMessage.builder()
                .error(message)
                .build();
    }

    public CustomException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
        errorMessage = ErrorMessage.builder()
                .error(message)
                .build();
    }
}