package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import supmeal_backend.entity.ShoppingList;
import supmeal_backend.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShoppingListRepository extends JpaRepository<ShoppingList, Long> {

    List<ShoppingList> findByUser(User user);

    Optional<ShoppingList> findByIdAndUser(Long id, User user);
}
