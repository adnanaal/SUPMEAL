package supmeal_backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.ShoppingListItemCreateRequest;
import supmeal_backend.dto.request.ShoppingListItemUpdateRequest;
import supmeal_backend.dto.response.ShoppingListItemResponse;
import supmeal_backend.entity.MealPlanning;
import supmeal_backend.entity.ShoppingList;
import supmeal_backend.entity.ShoppingListItem;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.repository.MealPlanningRepository;
import supmeal_backend.repository.ShoppingListRepository;

@Component
@RequiredArgsConstructor
public class ShoppingListItemMapper {

    private final ShoppingListRepository shoppingListRepository;
    private final MealPlanningRepository mealPlanningRepository;

    public ShoppingListItemResponse toResponse(ShoppingListItem shoppingListItem) {
        if (shoppingListItem == null) {
            return null;
        }
        
        return ShoppingListItemResponse.builder()
                .id(shoppingListItem.getId())
                .shoppingListId(shoppingListItem.getShoppingList().getId())
                .ingredientName(shoppingListItem.getIngredientName())
                .quantity(shoppingListItem.getQuantity())
                .unit(shoppingListItem.getUnit())
                .checked(shoppingListItem.getChecked())
                .sourceMealPlanId(shoppingListItem.getSourceMealPlan() != null ? shoppingListItem.getSourceMealPlan().getId() : null)
                .sourceRecipeTitle(shoppingListItem.getSourceRecipeTitle())
                .sourceMealType(shoppingListItem.getSourceMealType())
                .sourceDate(shoppingListItem.getSourceDate())
                .build();
    }

    public ShoppingListItem toEntity(ShoppingListItemCreateRequest request) {
        if (request == null) {
            return null;
        }
        
        ShoppingList shoppingList = shoppingListRepository.findById(request.getShoppingListId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Shopping list not found with id: %d", request.getShoppingListId())));
        
        ShoppingListItem.ShoppingListItemBuilder builder = ShoppingListItem.builder()
                .shoppingList(shoppingList)
                .ingredientName(request.getIngredientName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .checked(request.getChecked())
                .sourceRecipeTitle(request.getSourceRecipeTitle())
                .sourceMealType(request.getSourceMealType())
                .sourceDate(request.getSourceDate());
        
        if (request.getSourceMealPlanId() != null) {
            MealPlanning mealPlanning = mealPlanningRepository.findById(request.getSourceMealPlanId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Meal planning not found with id: %d", request.getSourceMealPlanId())));
            builder.sourceMealPlan(mealPlanning);
        }
        
        return builder.build();
    }

    public ShoppingListItem toEntity(ShoppingListItemUpdateRequest request) {
        if (request == null) {
            return null;
        }
        
        return ShoppingListItem.builder()
                .ingredientName(request.getIngredientName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .checked(request.getChecked())
                .build();
    }
}
