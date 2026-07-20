package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.ShoppingListCreateRequest;
import supmeal_backend.dto.request.ShoppingListUpdateRequest;
import supmeal_backend.dto.response.ShoppingListResponse;
import supmeal_backend.entity.ShoppingList;
import supmeal_backend.entity.User;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.ShoppingListMapper;
import supmeal_backend.service.ShoppingListService;
import supmeal_backend.service.UserService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shopping-lists")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ShoppingListController {

    private final ShoppingListService shoppingListService;
    private final ShoppingListMapper shoppingListMapper;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ShoppingListResponse> createShoppingList(
            @Valid @RequestBody ShoppingListCreateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        ShoppingList shoppingList = shoppingListMapper.toEntity(request);
        shoppingList.setUser(user);
        ShoppingList savedShoppingList = shoppingListService.save(shoppingList);
        return new ResponseEntity<>(shoppingListMapper.toResponse(savedShoppingList), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ShoppingListResponse>> getAllShoppingLists(@RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        List<ShoppingList> shoppingLists = shoppingListService.findByUser(user);
        List<ShoppingListResponse> responses = shoppingLists.stream()
                .map(shoppingListMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShoppingListResponse> getShoppingListById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        ShoppingList shoppingList = shoppingListService.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Shopping list not found with id: %d", id)));
        return ResponseEntity.ok(shoppingListMapper.toResponse(shoppingList));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShoppingListResponse> updateShoppingList(
            @PathVariable Long id,
            @Valid @RequestBody ShoppingListUpdateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        ShoppingList existingShoppingList = shoppingListService.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Shopping list not found with id: %d", id)));
        
        if (request.getName() != null) {
            existingShoppingList.setName(request.getName());
        }
        if (request.getDescription() != null) {
            existingShoppingList.setDescription(request.getDescription());
        }
        
        ShoppingList updatedShoppingList = shoppingListService.update(existingShoppingList);
        return ResponseEntity.ok(shoppingListMapper.toResponse(updatedShoppingList));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShoppingList(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        ShoppingList shoppingList = shoppingListService.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Shopping list not found with id: %d", id)));
        shoppingListService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
