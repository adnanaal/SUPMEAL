package supmeal_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.entity.User;
import supmeal_backend.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserPreferencesController {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/{userId}/preferences")
    public ResponseEntity<?> getUserPreferences(
            @PathVariable Long userId,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        try {
            System.out.println("Getting preferences for userId: " + userId);
            // Vérifier l'authentification via header
            Long authenticatedUserId = headerUserId != null ? Long.parseLong(headerUserId) : userId;
            
            User user = userRepository.findById(authenticatedUserId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("User found: " + user.getId());
            System.out.println("Dietary preferences: " + user.getDietaryPreferences());
            System.out.println("Allergies: " + user.getAllergies());
            System.out.println("Favorite cuisine: " + user.getFavoriteCuisine());
            System.out.println("Default servings: " + user.getDefaultServings());

            Map<String, Object> preferences = new HashMap<>();
            
            // Parser les chaînes JSON en tableaux
            List<String> dietaryPreferences = parseJsonArray(user.getDietaryPreferences());
            List<String> allergies = parseJsonArray(user.getAllergies());
            List<String> favoriteCuisine = parseJsonArray(user.getFavoriteCuisine());
            
            preferences.put("dietaryPreferences", dietaryPreferences);
            preferences.put("allergies", allergies);
            preferences.put("favoriteCuisine", favoriteCuisine);
            preferences.put("defaultServings", user.getDefaultServings() != null ? user.getDefaultServings() : 1);

            System.out.println("Returning preferences: " + preferences);
            return ResponseEntity.ok(preferences);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error getting preferences: " + e.getMessage());
            // Retourner des valeurs par défaut en cas d'erreur
            Map<String, Object> defaultPreferences = new HashMap<>();
            defaultPreferences.put("dietaryPreferences", List.of());
            defaultPreferences.put("allergies", List.of());
            defaultPreferences.put("favoriteCuisine", List.of());
            defaultPreferences.put("defaultServings", 1);
            return ResponseEntity.ok(defaultPreferences);
        }
    }

    @PutMapping("/{userId}/preferences")
    public ResponseEntity<?> updateUserPreferences(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> preferences,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        try {
            System.out.println("Updating preferences for userId: " + userId);
            System.out.println("Preferences data: " + preferences);
            
            // Vérifier l'authentification via header
            Long authenticatedUserId = headerUserId != null ? Long.parseLong(headerUserId) : userId;
            
            User user = userRepository.findById(authenticatedUserId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("User found: " + user.getId());

            // Mettre à jour les préférences
            if (preferences.containsKey("dietaryPreferences")) {
                @SuppressWarnings("unchecked")
                List<String> dietaryPreferences = (List<String>) preferences.get("dietaryPreferences");
                user.setDietaryPreferences(objectMapper.writeValueAsString(dietaryPreferences));
                System.out.println("Updated dietary preferences: " + dietaryPreferences);
            }
            
            if (preferences.containsKey("allergies")) {
                @SuppressWarnings("unchecked")
                List<String> allergies = (List<String>) preferences.get("allergies");
                user.setAllergies(objectMapper.writeValueAsString(allergies));
                System.out.println("Updated allergies: " + allergies);
            }
            
            if (preferences.containsKey("favoriteCuisine")) {
                @SuppressWarnings("unchecked")
                List<String> favoriteCuisine = (List<String>) preferences.get("favoriteCuisine");
                user.setFavoriteCuisine(objectMapper.writeValueAsString(favoriteCuisine));
                System.out.println("Updated favorite cuisine: " + favoriteCuisine);
            }
            
            if (preferences.containsKey("defaultServings")) {
                Integer servings = (Integer) preferences.get("defaultServings");
                user.setDefaultServings(servings);
                System.out.println("Updated default servings: " + servings);
            }

            User savedUser = userRepository.save(user);
            System.out.println("User saved successfully");

            // Retourner les préférences mises à jour
            Map<String, Object> updatedPreferences = new HashMap<>();
            updatedPreferences.put("dietaryPreferences", parseJsonArray(savedUser.getDietaryPreferences()));
            updatedPreferences.put("allergies", parseJsonArray(savedUser.getAllergies()));
            updatedPreferences.put("favoriteCuisine", parseJsonArray(savedUser.getFavoriteCuisine()));
            updatedPreferences.put("defaultServings", savedUser.getDefaultServings() != null ? savedUser.getDefaultServings() : 1);

            System.out.println("Returning updated preferences: " + updatedPreferences);
            return ResponseEntity.ok(updatedPreferences);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error updating preferences: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update preferences: " + e.getMessage()));
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseJsonArray(String json) {
        if (json == null || json.isEmpty()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, List.class);
        } catch (Exception e) {
            // Fallback: essayer de parser comme CSV
            return List.of(json.split(","));
        }
    }
}
