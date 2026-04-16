package alquiler.api.services;

import alquiler.api.models.UserModel;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Optional;

public interface IUserService {
    // CRUD
    // c -> create insert into modulo
    // r -> read select from
    // u -> update update from
    // d -> delete from
    // Solo haremos las read

    // Operativas READ
    ArrayList<UserModel> getUsers();
    Optional<UserModel> getUserByID(long id);
}
