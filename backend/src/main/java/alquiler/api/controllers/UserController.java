package alquiler.api.controllers;

import alquiler.api.models.UserModel;
import alquiler.api.models.ViviendaModel;
import alquiler.api.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService userService;

    @PutMapping
    public UserModel addNewUser(@RequestBody UserModel usuarioNuevo) {
        return userService.createUser(usuarioNuevo);
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
