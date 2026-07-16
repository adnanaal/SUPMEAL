package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.FavoriteRecipe;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.User;
import supmeal_backend.repository.FavoriteRecipeRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteRecipeService {

    private final FavoriteRecipeRepository favoriteRecipeRepository;

    public FavoriteRecipe save(FavoriteRecipe favoriteRecipe) {
        return favoriteRecipeRepository.save(favoriteRecipe);
    }

    public List<FavoriteRecipe> findAll() {
        return favoriteRecipeRepository.findAll();
    }

    public Optional<FavoriteRecipe> findById(Long id) {
        return favoriteRecipeRepository.findById(id);
    }

    public List<FavoriteRecipe> findByUser(User user) {
        return favoriteRecipeRepository.findByUser(user);
    }

    public Optional<FavoriteRecipe> findByUserAndRecipe(User user, Recipe recipe) {
        return favoriteRecipeRepository.findByUserAndRecipe(user, recipe);
    }

    public boolean existsByUserAndRecipe(User user, Recipe recipe) {
        return favoriteRecipeRepository.findByUserAndRecipe(user, recipe).isPresent();
    }

    public FavoriteRecipe update(FavoriteRecipe favoriteRecipe) {
        return favoriteRecipeRepository.save(favoriteRecipe);
    }

    public void delete(Long id) {
        favoriteRecipeRepository.deleteById(id);
    }
}
