package alquiler.api.repositories;

import alquiler.api.models.UserModel;
import alquiler.api.models.ViviendaModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IViviendaRepository extends JpaRepository<ViviendaModel, Long> {

}
