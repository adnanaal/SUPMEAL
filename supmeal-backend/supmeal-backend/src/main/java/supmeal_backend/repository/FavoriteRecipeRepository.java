package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import supmeal_backend.entity.FavoriteRecipe;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.User;

import java.util.List;
import java.util.Optional;

public interface FavoriteRecipeRepository extends JpaRepository<FavoriteRecipe, Long> {

    List<FavoriteRecipe> findByUser(User user);

    Optional<FavoriteRecipe> findByUserAndRecipe(User user, Recipe recipe);
}