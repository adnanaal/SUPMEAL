package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.ShoppingList;
import supmeal_backend.entity.User;
import supmeal_backend.repository.ShoppingListRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ShoppingListService {

    private final ShoppingListRepository shoppingListRepository;

    public ShoppingList save(ShoppingList shoppingList) {
        return shoppingListRepository.save(shoppingList);
    }

    public List<ShoppingList> findAll() {
        return shoppingListRepository.findAll();
    }

    public Optional<ShoppingList> findById(Long id) {
        return shoppingListRepository.findById(id);
    }

    public List<ShoppingList> findByUser(User user) {
        return shoppingListRepository.findByUser(user);
    }

    public Optional<ShoppingList> findByIdAndUser(Long id, User user) {
        return shoppingListRepository.findByIdAndUser(id, user);
    }

    public ShoppingList update(ShoppingList shoppingList) {
        return shoppingListRepository.save(shoppingList);
    }

    public void delete(Long id) {
        shoppingListRepository.deleteById(id);
    }
}
