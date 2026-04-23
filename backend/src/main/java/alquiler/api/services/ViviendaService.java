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

    @Autowired
    IUserRepository usuariosRepository;

    @Override
    public ArrayList<ViviendaModel> getViviendas() {
        return (ArrayList<ViviendaModel>) viviendaRepository.findAll();
    }

    @Override
    public Optional<ViviendaModel> getViviendaByID(long id) {
        return viviendaRepository.findById(id);
    }

    @Override
    public ViviendaModel updateVivienda(long id, ViviendaModel nuevaVivienda) {
        Optional<ViviendaModel> viviendaExistente = viviendaRepository.findById(id);
        if (viviendaExistente.isPresent()) {
            ViviendaModel viviendaDB = viviendaExistente.get();
            if (nuevaVivienda.getDireccion() != null) {
                viviendaDB.setDireccion(nuevaVivienda.getDireccion());
            }
            if (nuevaVivienda.getPrecio() != null) {
                viviendaDB.setPrecio(nuevaVivienda.getPrecio());
            }
            if (nuevaVivienda.getDisponible() != null) {
                viviendaDB.setDisponible(nuevaVivienda.getDisponible());
            }
            if(nuevaVivienda.getNumeroHabitaciones() != null) {
                viviendaDB.setNumeroHabitaciones(nuevaVivienda.getNumeroHabitaciones());
            }
            return viviendaRepository.save(viviendaDB);
        }
        return null;
    }

    @Override
    public boolean deleteVivienda(long id) {
        try {
            // 1. Buscamos si existe algún usuario que tenga esta vivienda asignada
            Optional<UserModel> usuarioOpt = usuariosRepository.findByViviendaId(id);

            if (usuarioOpt.isPresent()) {
                UserModel usuario = usuarioOpt.get();

                // 2. IMPORTANTE: Rompemos la relación
                // Ponemos la vivienda a null para que el usuario ya no la "sujete"
                usuario.setVivienda(null);

                // 3. Guardamos los cambios en el usuario
                // Ahora en la base de datos, la columna vivienda_id de este usuario será NULL
                usuariosRepository.save(usuario);
            }

            // 4. Una vez liberada la restricción, procedemos a borrar la vivienda
            if (viviendaRepository.existsById(id)) {
                viviendaRepository.deleteById(id);
                return true;
            }

            return false; // La vivienda no existía

        } catch (Exception e) {
            // Es buena práctica imprimir el error para saber qué falló si vuelve a pasar
            System.err.println("Error al eliminar vivienda: " + e.getMessage());
            return false;
        }
    }

    @Override
    public ViviendaModel crearVivienda(ViviendaModel viviendaNueva) {
        return viviendaRepository.save(viviendaNueva);
    }
}
