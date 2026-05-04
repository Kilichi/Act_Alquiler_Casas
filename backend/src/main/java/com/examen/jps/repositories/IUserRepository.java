package com.examen.jps.repositories;

import com.examen.jps.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserRepository  extends JpaRepository<UserModel, Long> {
}
