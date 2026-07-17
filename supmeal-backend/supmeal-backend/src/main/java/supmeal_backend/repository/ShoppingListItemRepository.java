package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import supmeal_backend.entity.ShoppingListItem;
import supmeal_backend.entity.ShoppingList;

import java.util.List;

@Repository
public interface ShoppingListItemRepository extends JpaRepository<ShoppingListItem, Long> {

    List<ShoppingListItem> findByShoppingList(ShoppingList shoppingList);

    List<ShoppingListItem> findByShoppingListId(Long shoppingListId);
}
