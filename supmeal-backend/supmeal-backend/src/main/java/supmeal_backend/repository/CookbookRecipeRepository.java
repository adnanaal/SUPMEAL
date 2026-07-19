package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import supmeal_backend.entity.CookbookRecipe;

import java.util.List;
import java.util.Optional;

@Repository
public interface CookbookRecipeRepository extends JpaRepository<CookbookRecipe, Long> {

    Optional<CookbookRecipe> findByCookbookIdAndRecipeId(Long cookbookId, Long recipeId);

    List<CookbookRecipe> findByCookbookId(Long cookbookId);

    @Query("SELECT cr.recipe.id FROM CookbookRecipe cr WHERE cr.cookbook.id = :cookbookId")
    List<Long> findRecipeIdsByCookbookId(@Param("cookbookId") Long cookbookId);

    void deleteByCookbookIdAndRecipeId(Long cookbookId, Long recipeId);
}
