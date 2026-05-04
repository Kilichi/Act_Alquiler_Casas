package com.examen.jps.services;

import com.examen.jps.models.UserModel;
import com.examen.jps.repositories.IUserRepository;
import com.examen.jps.utils.PasswordValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserService implements IUserService {

    @Autowired
    IUserRepository userRepository;

    @Override
    public UserModel createUser(UserModel usuario) {
        if (!PasswordValidator.esPasswordValida(usuario.getPassword())) {
            return null;
        }
        return userRepository.save(usuario);
    }

    @Override
    public ArrayList<UserModel> getUsers() {
        return (ArrayList<UserModel>) userRepository.findAll();
    }

    @Override
    public Optional<UserModel> getUserByID(long id) {
        return userRepository.findById(id);
    }

    @Override
    public UserModel updateUser(long id, UserModel usuario) {
        boolean constraseniaValida = false;
        Optional<UserModel> usuarioExistente = userRepository.findById(id);
        if (usuarioExistente.isPresent()) {
            UserModel dbUser = usuarioExistente.get();
            if (usuario.getNif() != null) {
                dbUser.setNif(usuario.getNif());
            }
            if(usuario.getUsername() != null) {
                dbUser.setUsername(usuario.getUsername());
            }
            if(usuario.getNombre() != null) {
                dbUser.setNombre(usuario.getNombre());
            }
            if (usuario.getApellidos() != null) {
                dbUser.setApellidos(usuario.getApellidos());
            }
            if (usuario.getEmail() != null) {
                dbUser.setEmail(usuario.getEmail());
            }
            if (usuario.getPassword() != null) {
                if (!PasswordValidator.esPasswordValida(usuario.getPassword())) {
                    throw new IllegalArgumentException("La contraseña no cumple los requisitos de seguridad.");
                } else {
                    dbUser.setPassword(usuario.getPassword());
                }
            }
            if(usuario.getProfile() != null) {
                dbUser.setProfile(usuario.getProfile());
            }
            return userRepository.save(dbUser);
        }
        return null;
    }

    @Override
    public boolean deleteUser(long id) {
        try{
            userRepository.deleteById(id);
        } catch (Exception e) {
            System.out.println("Error: "+e);
            return false;
        }
        return true;
    }
}
