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
    public ResponseEntity<ShoppingListItemResponse> createShoppingListItem(@Valid @RequestBody ShoppingListItemCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with email: %s", email)));
        
        ShoppingList shoppingList = shoppingListService.findByIdAndUser(request.getShoppingListId(), user)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Shopping list not found with id: %d", request.getShoppingListId())));
        
        ShoppingListItem shoppingListItem = shoppingListItemMapper.toEntity(request);
        ShoppingListItem savedShoppingListItem = shoppingListItemService.save(shoppingListItem);
        return new ResponseEntity<>(shoppingListItemMapper.toResponse(savedShoppingListItem), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ShoppingListItemResponse>> getAllShoppingListItems() {
        List<ShoppingListItem> shoppingListItems = shoppingListItemService.findAll();
        List<ShoppingListItemResponse> responses = shoppingListItems.stream()
                .map(shoppingListItemMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShoppingListItemResponse> getShoppingListItemById(@PathVariable Long id) {
        ShoppingListItem shoppingListItem = shoppingListItemService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Shopping list item not found with id: %d", id)));
        return ResponseEntity.ok(shoppingListItemMapper.toResponse(shoppingListItem));
    }

    @GetMapping("/shopping-list/{shoppingListId}")
    public ResponseEntity<List<ShoppingListItemResponse>> getShoppingListItemsByShoppingList(@PathVariable Long shoppingListId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with email: %s", email)));
        
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
