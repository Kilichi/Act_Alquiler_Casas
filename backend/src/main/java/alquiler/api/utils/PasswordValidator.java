package alquiler.api.utils;

public class PasswordValidator {
    private static final String PASSWORD_PATTERN =
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!¿?*.,\\-_])(?=\\S+$).{8,}$";

    public static boolean esPasswordValida(String password) {
        if (password == null) {
            return false;
        }
        return password.matches(PASSWORD_PATTERN);
    }
}
