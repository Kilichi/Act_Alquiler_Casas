package alquiler.api.repositories;

import alquiler.api.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUserRepository  extends JpaRepository<UserModel, Long> {

}
