package alquiler.api.controllers;

import alquiler.api.models.UserModel;
import alquiler.api.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService userService;

    @GetMapping
    public ArrayList<UserModel> getAllUsers(){
        return this.userService.getUsers();
    }

    @GetMapping("/{id}")
    public Optional<UserModel> getUserByID(@PathVariable Long id){
        return this.userService.getUserByID(id);
    }
}
