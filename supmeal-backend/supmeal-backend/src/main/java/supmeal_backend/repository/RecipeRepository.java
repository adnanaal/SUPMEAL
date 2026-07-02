package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.User;
import supmeal_backend.entity.enums.MealType;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    List<Recipe> findByTitleContainingIgnoreCase(String title);

    boolean existsByTitle(String title);

    List<Recipe> findByOwner(User owner);

    List<Recipe> findByMealType(MealType mealType);
}