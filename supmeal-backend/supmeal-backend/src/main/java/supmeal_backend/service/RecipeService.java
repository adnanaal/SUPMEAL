package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.User;
import supmeal_backend.entity.enums.MealType;
import supmeal_backend.repository.RecipeRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public Recipe save(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public List<Recipe> findAll() {
        return recipeRepository.findAll();
    }

    public Optional<Recipe> findById(Long id) {
        return recipeRepository.findById(id);
    }

    public List<Recipe> findByTitleContainingIgnoreCase(String title) {
        return recipeRepository.findByTitleContainingIgnoreCase(title);
    }

    public boolean existsByTitle(String title) {
        return recipeRepository.existsByTitle(title);
    }

    public List<Recipe> findByOwner(User owner) {
        return recipeRepository.findByOwner(owner);
    }

    public List<Recipe> findByMealType(MealType mealType) {
        return recipeRepository.findByMealType(mealType);
    }

    public Recipe update(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public void delete(Long id) {
        recipeRepository.deleteById(id);
    }
}
