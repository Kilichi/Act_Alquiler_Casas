package alquiler.api.services;

import alquiler.api.models.UserModel;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Optional;

public interface IUserService {
    // CRUD
    // c -> create insert into modulo x
    // r -> read select from x
    // u -> update from
    // d -> delete from
    // Solo haremos las read

    // Operativas CREATE
    UserModel createUser(UserModel usuario);

    // Operativas READ
    ArrayList<UserModel> getUsers();
    Optional<UserModel> getUserByID(long id);

    // Operativas UPDATE
    UserModel updateUser(long id, UserModel usuario);

    boolean deleteUser(long id);
}
