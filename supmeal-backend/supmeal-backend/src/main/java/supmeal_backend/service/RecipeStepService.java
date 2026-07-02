package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.RecipeStep;
import supmeal_backend.repository.RecipeStepRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RecipeStepService {

    private final RecipeStepRepository recipeStepRepository;

    public RecipeStep save(RecipeStep recipeStep) {
        return recipeStepRepository.save(recipeStep);
    }

    public List<RecipeStep> findAll() {
        return recipeStepRepository.findAll();
    }

    public Optional<RecipeStep> findById(Long id) {
        return recipeStepRepository.findById(id);
    }

    public List<RecipeStep> findByRecipeOrderByStepOrderAsc(Recipe recipe) {
        return recipeStepRepository.findByRecipeOrderByStepOrderAsc(recipe);
    }

    public RecipeStep update(RecipeStep recipeStep) {
        return recipeStepRepository.save(recipeStep);
    }

    public void delete(Long id) {
        recipeStepRepository.deleteById(id);
    }
}
