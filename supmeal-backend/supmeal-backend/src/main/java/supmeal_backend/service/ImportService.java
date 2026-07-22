package supmeal_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.dto.CookbookExport;
import supmeal_backend.dto.ExportData;
import supmeal_backend.dto.IngredientExport;
import supmeal_backend.dto.RecipeExport;
import supmeal_backend.dto.RecipeStepExport;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.CookbookMember;
import supmeal_backend.entity.CookbookPermission;
import supmeal_backend.entity.CookbookRecipe;
import supmeal_backend.entity.Ingredient;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.RecipeStep;
import supmeal_backend.entity.Tag;
import supmeal_backend.entity.User;
import supmeal_backend.entity.enums.MealType;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.repository.CookbookRepository;
import supmeal_backend.repository.RecipeRepository;
import supmeal_backend.repository.TagRepository;
import supmeal_backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImportService {

    private final RecipeRepository recipeRepository;
    private final CookbookRepository cookbookRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public void importUserData(Long userId, String jsonData) {
        try {
            System.out.println("=== IMPORT START ===");
            System.out.println("User ID: " + userId);
            System.out.println("JSON Data length: " + jsonData.length());
            
            ExportData exportData = objectMapper.readValue(jsonData, ExportData.class);
            System.out.println("ExportData parsed - Version: " + exportData.getVersion());
            System.out.println("Recipes count: " + exportData.getRecipes().size());
            System.out.println("Cookbooks count: " + exportData.getCookbooks().size());
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            System.out.println("User found: " + user.getEmail());

            // Importer les recettes
            Map<Long, Long> recipeIdMap = importRecipes(exportData.getRecipes(), user);
            System.out.println("Recipes imported successfully. ID map size: " + recipeIdMap.size());

            // Importer les cookbooks
            importCookbooks(exportData.getCookbooks(), user, recipeIdMap);
            System.out.println("Cookbooks imported successfully");
            
            System.out.println("=== IMPORT COMPLETE ===");

        } catch (Exception e) {
            System.out.println("=== IMPORT ERROR ===");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to import data: " + e.getMessage(), e);
        }
    }

    private Map<Long, Long> importRecipes(List<RecipeExport> recipeExports, User user) {
        Map<Long, Long> idMap = new java.util.HashMap<>();
        
        for (RecipeExport recipeExport : recipeExports) {
            System.out.println("Importing recipe: " + recipeExport.getTitle());
            
            MealType mealType = null;
            if (recipeExport.getMealType() != null) {
                try {
                    mealType = MealType.valueOf(recipeExport.getMealType());
                } catch (IllegalArgumentException e) {
                    // Si le mealType n'est pas valide, on laisse null
                }
            }

            Recipe recipe = Recipe.builder()
                    .title(recipeExport.getTitle())
                    .description(recipeExport.getDescription())
                    .imagePath(recipeExport.getImagePath())
                    .cookingTime(recipeExport.getCookingTime())
                    .preparationTime(recipeExport.getPreparationTime())
                    .servings(recipeExport.getServings())
                    .mealType(mealType)
                    .source(recipeExport.getSource())
                    .sourceUrl(recipeExport.getSourceUrl())
                    .owner(user)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // Importer les ingrédients
            List<Ingredient> ingredients = recipeExport.getIngredients().stream()
                    .map(this::mapToIngredient)
                    .collect(Collectors.toList());
            ingredients.forEach(i -> i.setRecipe(recipe));
            recipe.setIngredients(ingredients);

            // Importer les étapes
            List<RecipeStep> steps = recipeExport.getSteps().stream()
                    .map(this::mapToRecipeStep)
                    .collect(Collectors.toList());
            steps.forEach(s -> s.setRecipe(recipe));
            recipe.setSteps(steps);

            // Importer les tags
            List<Tag> tags = recipeExport.getTags().stream()
                    .map(tagName -> findOrCreateTag(tagName))
                    .collect(Collectors.toList());
            recipe.setTags(tags);

            Recipe savedRecipe = recipeRepository.save(recipe);
            idMap.put(recipeExport.getId(), savedRecipe.getId());
        }

        return idMap;
    }

    private Ingredient mapToIngredient(IngredientExport export) {
        return Ingredient.builder()
                .name(export.getName())
                .quantity(export.getQuantity())
                .unit(export.getUnit())
                .build();
    }

    private RecipeStep mapToRecipeStep(RecipeStepExport export) {
        return RecipeStep.builder()
                .stepOrder(export.getStepOrder())
                .instruction(export.getInstruction())
                .build();
    }

    private Tag findOrCreateTag(String tagName) {
        return tagRepository.findByName(tagName)
                .orElseGet(() -> {
                    Tag tag = Tag.builder()
                            .name(tagName)
                            .createdAt(LocalDateTime.now())
                            .build();
                    return tagRepository.save(tag);
                });
    }

    private void importCookbooks(List<CookbookExport> cookbookExports, User user, Map<Long, Long> recipeIdMap) {
        for (CookbookExport cookbookExport : cookbookExports) {
            Cookbook cookbook = Cookbook.builder()
                    .name(cookbookExport.getName())
                    .description(cookbookExport.getDescription())
                    .coverImage(cookbookExport.getCoverImage())
                    .owner(user)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .members(new ArrayList<>())
                    .cookbookRecipes(new ArrayList<>())
                    .build();

            // Ajouter le propriétaire comme membre OWNER
            CookbookMember ownerMember = CookbookMember.builder()
                    .cookbook(cookbook)
                    .user(user)
                    .permission(CookbookPermission.OWNER)
                    .joinedAt(LocalDateTime.now())
                    .build();
            cookbook.getMembers().add(ownerMember);

            // Importer les recettes dans le cookbook
            for (Long oldRecipeId : cookbookExport.getRecipeIds()) {
                Long newRecipeId = recipeIdMap.get(oldRecipeId);
                if (newRecipeId != null) {
                    Recipe recipe = recipeRepository.findById(newRecipeId)
                            .orElse(null);
                    if (recipe != null) {
                        CookbookRecipe cookbookRecipe = CookbookRecipe.builder()
                                .cookbook(cookbook)
                                .recipe(recipe)
                                .addedBy(user)
                                .addedAt(LocalDateTime.now())
                                .build();
                        cookbook.getCookbookRecipes().add(cookbookRecipe);
                    }
                }
            }

            // Note: Les membres supplémentaires ne sont pas importés car ils nécessitent
            // que les utilisateurs existent déjà dans le système
            // On pourrait créer des invitations pour eux à la place

            cookbookRepository.save(cookbook);
        }
    }
}
