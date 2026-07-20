package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.ShoppingListItemCreateRequest;
import supmeal_backend.dto.request.ShoppingListItemUpdateRequest;
import supmeal_backend.dto.response.ShoppingListItemResponse;
import supmeal_backend.entity.ShoppingList;
import supmeal_backend.entity.ShoppingListItem;
import supmeal_backend.entity.User;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.ShoppingListItemMapper;
import supmeal_backend.service.ShoppingListItemService;
import supmeal_backend.service.ShoppingListService;
import supmeal_backend.service.UserService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shopping-list-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ShoppingListItemController {

    private final ShoppingListItemService shoppingListItemService;
    private final ShoppingListItemMapper shoppingListItemMapper;
    private final ShoppingListService shoppingListService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ShoppingListItemResponse> createShoppingListItem(
            @Valid @RequestBody ShoppingListItemCreateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        ShoppingList shoppingList = shoppingListService.findByIdAndUser(request.getShoppingListId(), user)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Shopping list not found with id: %d", request.getShoppingListId())));
        
        ShoppingListItem shoppingListItem = shoppingListItemMapper.toEntity(request);
        ShoppingListItem savedShoppingListItem = shoppingListItemService.save(shoppingListItem);
        return new ResponseEntity<>(shoppingListItemMapper.toResponse(savedShoppingListItem), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ShoppingListItemResponse>> getAllShoppingListItems(@RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        List<ShoppingListItem> shoppingListItems = shoppingListItemService.findAll();
        // Filtrer par utilisateur via la shopping list
        List<ShoppingListItemResponse> responses = shoppingListItems.stream()
                .filter(item -> {
                    ShoppingList list = item.getShoppingList();
                    return list != null && list.getUser() != null && list.getUser().getId().equals(userId);
                })
                .map(shoppingListItemMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShoppingListItemResponse> getShoppingListItemById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        ShoppingListItem shoppingListItem = shoppingListItemService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Shopping list item not found with id: %d", id)));
        
        // Vérifier que l'utilisateur a accès à la shopping list
        ShoppingList shoppingList = shoppingListItem.getShoppingList();
        if (shoppingList.getUser() == null || !shoppingList.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Shopping list item not found");
        }
        
        return ResponseEntity.ok(shoppingListItemMapper.toResponse(shoppingListItem));
    }

    @GetMapping("/shopping-list/{shoppingListId}")
    public ResponseEntity<List<ShoppingListItemResponse>> getShoppingListItemsByShoppingList(
            @PathVariable Long shoppingListId,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        ShoppingList shoppingList = shoppingListService.findByIdAndUser(shoppingListId, user)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Shopping list not found with id: %d", shoppingListId)));
        
        List<ShoppingListItem> shoppingListItems = shoppingListItemService.findByShoppingList(shoppingList);
        List<ShoppingListItemResponse> responses = shoppingListItems.stream()
                .map(shoppingListItemMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShoppingListItemResponse> updateShoppingListItem(@PathVariable Long id, @Valid @RequestBody ShoppingListItemUpdateRequest request) {
        ShoppingListItem existingShoppingListItem = shoppingListItemService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Shopping list item not found with id: %d", id)));
        
        if (request.getIngredientName() != null) {
            existingShoppingListItem.setIngredientName(request.getIngredientName());
        }
        if (request.getQuantity() != null) {
            existingShoppingListItem.setQuantity(request.getQuantity());
        }
        if (request.getUnit() != null) {
            existingShoppingListItem.setUnit(request.getUnit());
        }
        if (request.getChecked() != null) {
            existingShoppingListItem.setChecked(request.getChecked());
        }
        
        ShoppingListItem updatedShoppingListItem = shoppingListItemService.update(existingShoppingListItem);
        return ResponseEntity.ok(shoppingListItemMapper.toResponse(updatedShoppingListItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShoppingListItem(@PathVariable Long id) {
        ShoppingListItem shoppingListItem = shoppingListItemService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Shopping list item not found with id: %d", id)));
        shoppingListItemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
