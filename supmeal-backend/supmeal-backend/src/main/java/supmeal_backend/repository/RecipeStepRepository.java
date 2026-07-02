package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.RecipeStep;

import java.util.List;

public interface RecipeStepRepository extends JpaRepository<RecipeStep, Long> {

    List<RecipeStep> findByRecipeOrderByStepOrderAsc(Recipe recipe);

}