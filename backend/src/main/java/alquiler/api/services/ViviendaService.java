package alquiler.api.services;

import alquiler.api.models.UserModel;
import alquiler.api.models.ViviendaModel;
import alquiler.api.repositories.IUserRepository;
import alquiler.api.repositories.IViviendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class ViviendaService implements IViviendaService {

    @Autowired
    IViviendaRepository viviendaRepository;


    @Override
    public ArrayList<ViviendaModel> getViviendas() {
        return (ArrayList<ViviendaModel>) viviendaRepository.findAll();
    }

    @Override
    public Optional<ViviendaModel> getViviendaByID(long id) {
        return viviendaRepository.findById(id);
    }
}
