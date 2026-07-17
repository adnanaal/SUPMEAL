package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.ShoppingListItem;
import supmeal_backend.entity.ShoppingList;
import supmeal_backend.repository.ShoppingListItemRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ShoppingListItemService {

    private final ShoppingListItemRepository shoppingListItemRepository;

    public ShoppingListItem save(ShoppingListItem shoppingListItem) {
        return shoppingListItemRepository.save(shoppingListItem);
    }

    public List<ShoppingListItem> findAll() {
        return shoppingListItemRepository.findAll();
    }

    public Optional<ShoppingListItem> findById(Long id) {
        return shoppingListItemRepository.findById(id);
    }

    public List<ShoppingListItem> findByShoppingList(ShoppingList shoppingList) {
        return shoppingListItemRepository.findByShoppingList(shoppingList);
    }

    public List<ShoppingListItem> findByShoppingListId(Long shoppingListId) {
        return shoppingListItemRepository.findByShoppingListId(shoppingListId);
    }

    public ShoppingListItem update(ShoppingListItem shoppingListItem) {
        return shoppingListItemRepository.save(shoppingListItem);
    }

    public void delete(Long id) {
        shoppingListItemRepository.deleteById(id);
    }
}
