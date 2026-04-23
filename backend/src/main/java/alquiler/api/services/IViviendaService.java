package alquiler.api.services;

import alquiler.api.models.UserModel;
import alquiler.api.models.ViviendaModel;

import java.util.ArrayList;
import java.util.Optional;

public interface IViviendaService {
    // CRUD
    // c -> create insert into modulo x
    // r -> read select from x
    // u -> update from
    // d -> delete from
    // Solo haremos las read

    // Operativas Create
    ViviendaModel crearVivienda(ViviendaModel viviendaNueva);

    // Operativas READ
    ArrayList<ViviendaModel> getViviendas();
    Optional<ViviendaModel> getViviendaByID(long id);

    // Operativas Update
    ViviendaModel updateVivienda(long id, ViviendaModel nuevaVivienda);

    // Operativas delete
    boolean deleteVivienda(long id);

}
