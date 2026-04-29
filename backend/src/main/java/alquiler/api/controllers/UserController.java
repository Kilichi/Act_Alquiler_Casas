package alquiler.api.controllers;

import alquiler.api.models.UserModel;
import alquiler.api.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService userService;

    @PutMapping
    public ResponseEntity<?> addNewUser(@RequestBody UserModel usuarioNuevo) {
        try {
            UserModel nuevoUsuario = userService.createUser(usuarioNuevo);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ArrayList<UserModel> getAllUsers(){
        return this.userService.getUsers();
    }

    @GetMapping("/{id}")
    public Optional<UserModel> getUserByID(@PathVariable Long id){
        return this.userService.getUserByID(id);
    }

    @PatchMapping("/{id}")
    public UserModel actualizarUsuario(@PathVariable long id, @RequestBody UserModel usuarioActualizado) {
        return this.userService.updateUser(id, usuarioActualizado);
    }

    @DeleteMapping("/{id}")
    public boolean deleteUser(@PathVariable long id){
        return this.userService.deleteUser(id);
    }
}
