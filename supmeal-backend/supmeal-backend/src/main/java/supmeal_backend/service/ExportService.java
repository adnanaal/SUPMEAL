package supmeal_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import supmeal_backend.dto.*;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.CookbookMember;
import supmeal_backend.entity.CookbookRecipe;
import supmeal_backend.entity.Ingredient;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.RecipeStep;
import supmeal_backend.entity.Tag;
import supmeal_backend.entity.User;
import supmeal_backend.entity.enums.MealType;
import supmeal_backend.repository.CookbookRepository;
import supmeal_backend.repository.RecipeRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final RecipeRepository recipeRepository;
    private final CookbookRepository cookbookRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ExportData exportUserData(Long userId) {
        User user = getUserById(userId);
        
        List<Recipe> recipes = recipeRepository.findAll().stream()
                .filter(r -> r.getOwner() != null && r.getOwner().getId().equals(userId))
                .collect(Collectors.toList());
        
        List<Cookbook> cookbooks = cookbookRepository.findAll().stream()
                .filter(c -> c.getOwner() != null && c.getOwner().getId().equals(userId))
                .collect(Collectors.toList());

        List<RecipeExport> recipeExports = recipes.stream()
                .map(this::mapToRecipeExport)
                .collect(Collectors.toList());

        List<CookbookExport> cookbookExports = cookbooks.stream()
                .map(this::mapToCookbookExport)
                .collect(Collectors.toList());

        return ExportData.builder()
                .version("1.0")
                .exportedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .user(mapToUserData(user))
                .recipes(recipeExports)
                .cookbooks(cookbookExports)
                .build();
    }

    private User getUserById(Long userId) {
        // Pour l'instant, on utilise une méthode simple
        // Dans un vrai système, on utiliserait UserService
        return User.builder()
                .id(userId)
                .email("user@example.com")
                .firstname("User")
                .lastname("Name")
                .build();
    }

    private UserData mapToUserData(User user) {
        return UserData.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .avatar(user.getAvatar())
                .dietaryPreferences(user.getDietaryPreferences())
                .allergies(user.getAllergies())
                .favoriteCuisine(user.getFavoriteCuisine())
                .defaultServings(user.getDefaultServings())
                .build();
    }

    private RecipeExport mapToRecipeExport(Recipe recipe) {
        List<IngredientExport> ingredientExports = recipe.getIngredients().stream()
                .map(this::mapToIngredientExport)
                .collect(Collectors.toList());

        List<RecipeStepExport> stepExports = recipe.getSteps().stream()
                .map(this::mapToRecipeStepExport)
                .collect(Collectors.toList());

        List<String> tagNames = recipe.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toList());

        return RecipeExport.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .imagePath(recipe.getImagePath())
                .cookingTime(recipe.getCookingTime())
                .preparationTime(recipe.getPreparationTime())
                .servings(recipe.getServings())
                .mealType(recipe.getMealType() != null ? recipe.getMealType().name() : null)
                .source(recipe.getSource())
                .sourceUrl(recipe.getSourceUrl())
                .ingredients(ingredientExports)
                .steps(stepExports)
                .tags(tagNames)
                .build();
    }

    private IngredientExport mapToIngredientExport(Ingredient ingredient) {
        return IngredientExport.builder()
                .name(ingredient.getName())
                .quantity(ingredient.getQuantity())
                .unit(ingredient.getUnit())
                .build();
    }

    private RecipeStepExport mapToRecipeStepExport(RecipeStep step) {
        return RecipeStepExport.builder()
                .stepOrder(step.getStepOrder())
                .instruction(step.getInstruction())
                .build();
    }

    private CookbookExport mapToCookbookExport(Cookbook cookbook) {
        List<Long> recipeIds = cookbook.getCookbookRecipes().stream()
                .map(cr -> cr.getRecipe().getId())
                .collect(Collectors.toList());

        List<CookbookMemberExport> memberExports = cookbook.getMembers().stream()
                .map(this::mapToCookbookMemberExport)
                .collect(Collectors.toList());

        return CookbookExport.builder()
                .id(cookbook.getId())
                .name(cookbook.getName())
                .description(cookbook.getDescription())
                .coverImage(cookbook.getCoverImage())
                .recipeIds(recipeIds)
                .members(memberExports)
                .build();
    }

    private CookbookMemberExport mapToCookbookMemberExport(CookbookMember member) {
        return CookbookMemberExport.builder()
                .email(member.getUser().getEmail())
                .permission(member.getPermission().name())
                .build();
    }
}
