package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.CookbookRecipe;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.User;
import supmeal_backend.repository.CookbookRecipeRepository;
import supmeal_backend.repository.CookbookRepository;
import supmeal_backend.repository.RecipeRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CookbookService {

    private final CookbookRepository cookbookRepository;
    private final CookbookRecipeRepository cookbookRecipeRepository;
    private final RecipeRepository recipeRepository;

    public Cookbook save(Cookbook cookbook) {
        return cookbookRepository.save(cookbook);
    }

    public List<Cookbook> findAll() {
        return cookbookRepository.findAll();
    }

    public Optional<Cookbook> findById(Long id) {
        return cookbookRepository.findById(id);
    }

    public List<Cookbook> findByOwner(User owner) {
        return cookbookRepository.findByOwner(owner);
    }

    public Cookbook update(Cookbook cookbook) {
        return cookbookRepository.save(cookbook);
    }

    public void delete(Long id) {
        cookbookRepository.deleteById(id);
    }

    public void addRecipeToCookbook(Long cookbookId, Long recipeId) {
        System.out.println("addRecipeToCookbook called with cookbookId=" + cookbookId + ", recipeId=" + recipeId);
        
        Cookbook cookbook = findById(cookbookId)
                .orElseThrow(() -> new RuntimeException("Cookbook not found"));
        System.out.println("Cookbook found: " + cookbook.getName());
        
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        System.out.println("Recipe found: " + recipe.getTitle());

        Optional<CookbookRecipe> existing = cookbookRecipeRepository.findByCookbookIdAndRecipeId(cookbookId, recipeId);
        if (existing.isPresent()) {
            throw new RuntimeException("Recipe already in cookbook");
        }

        CookbookRecipe cookbookRecipe = CookbookRecipe.builder()
                .cookbook(cookbook)
                .recipe(recipe)
                .build();
        System.out.println("Saving CookbookRecipe...");
        cookbookRecipeRepository.save(cookbookRecipe);
        System.out.println("CookbookRecipe saved successfully");
    }

    public void removeRecipeFromCookbook(Long cookbookId, Long recipeId) {
        cookbookRecipeRepository.deleteByCookbookIdAndRecipeId(cookbookId, recipeId);
    }

    public List<Long> getRecipeIdsByCookbookId(Long cookbookId) {
        return cookbookRecipeRepository.findRecipeIdsByCookbookId(cookbookId);
    }
}
