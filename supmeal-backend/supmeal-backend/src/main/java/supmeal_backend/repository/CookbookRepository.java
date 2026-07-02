package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.User;

import java.util.List;

public interface CookbookRepository extends JpaRepository<Cookbook, Long> {

    List<Cookbook> findByOwner(User owner);

}