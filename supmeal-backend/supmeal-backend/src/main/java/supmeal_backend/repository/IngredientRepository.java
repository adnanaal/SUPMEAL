package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import supmeal_backend.entity.Ingredient;
import supmeal_backend.entity.Recipe;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    List<Ingredient> findByRecipe(Recipe recipe);

}