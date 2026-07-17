package supmeal_backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.ShoppingListCreateRequest;
import supmeal_backend.dto.request.ShoppingListUpdateRequest;
import supmeal_backend.dto.response.ShoppingListResponse;
import supmeal_backend.entity.MealPlanning;
import supmeal_backend.entity.ShoppingList;
import supmeal_backend.entity.ShoppingListItem;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.repository.MealPlanningRepository;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ShoppingListMapper {

    private final MealPlanningRepository mealPlanningRepository;

    public ShoppingListResponse toResponse(ShoppingList shoppingList) {
        if (shoppingList == null) {
            return null;
        }
        
        List<Long> mealPlanIds = shoppingList.getItems().stream()
                .filter(item -> item.getSourceMealPlan() != null)
                .map(item -> item.getSourceMealPlan().getId())
                .distinct()
                .collect(Collectors.toList());
        
        return ShoppingListResponse.builder()
                .id(shoppingList.getId())
                .name(shoppingList.getName())
                .description(shoppingList.getDescription())
                .createdAt(shoppingList.getCreatedAt())
                .updatedAt(shoppingList.getUpdatedAt())
                .userId(shoppingList.getUser() != null ? shoppingList.getUser().getId() : null)
                .mealPlanIds(mealPlanIds)
                .build();
    }

    public ShoppingList toEntity(ShoppingListCreateRequest request) {
        if (request == null) {
            return null;
        }
        
        ShoppingList shoppingList = ShoppingList.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        
        return shoppingList;
    }

    public ShoppingList toEntity(ShoppingListUpdateRequest request) {
        if (request == null) {
            return null;
        }
        
        return ShoppingList.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }
}
