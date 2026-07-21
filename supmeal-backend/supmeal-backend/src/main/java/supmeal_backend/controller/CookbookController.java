package supmeal_backend.controller;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.CookbookCreateRequest;
import supmeal_backend.dto.request.CookbookUpdateRequest;
import supmeal_backend.dto.response.CookbookResponse;
import supmeal_backend.dto.response.RecipeResponse;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.CookbookMember;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.User;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.CookbookMapper;
import supmeal_backend.mapper.RecipeMapper;
import supmeal_backend.service.CookbookInvitationService;
import supmeal_backend.service.CookbookMemberService;
import supmeal_backend.service.CookbookService;
import supmeal_backend.service.RecipeService;
import supmeal_backend.service.UserService;
import supmeal_backend.repository.CookbookMemberRepository;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cookbooks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CookbookController {

    private final CookbookService cookbookService;
    private final CookbookMapper cookbookMapper;
    private final RecipeService recipeService;
    private final RecipeMapper recipeMapper;
    private final UserService userService;
    private final CookbookMemberService cookbookMemberService;
    private final CookbookInvitationService cookbookInvitationService;
    private final CookbookMemberRepository cookbookMemberRepository;

    @PostMapping
    public ResponseEntity<CookbookResponse> createCookbook(@Valid @RequestBody CookbookCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User owner = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with email: %s", email)));
        
        Cookbook cookbook = cookbookMapper.toEntity(request);
        cookbook.setOwner(owner);
        Cookbook savedCookbook = cookbookService.save(cookbook);
        
        // Créer automatiquement le membre owner
        CookbookMember ownerMember = CookbookMember.builder()
                .cookbook(savedCookbook)
                .user(owner)
                .permission(supmeal_backend.entity.CookbookPermission.OWNER)
                .joinedAt(java.time.LocalDateTime.now())
                .build();
        cookbookMemberService.save(ownerMember);
        
        // Recharger le cookbook pour avoir les membres
        savedCookbook = cookbookService.findById(savedCookbook.getId()).orElse(savedCookbook);
        
        return new ResponseEntity<>(cookbookMapper.toResponse(savedCookbook), HttpStatus.CREATED);
    }

    @PostMapping("/{cookbookId}/recipes")
    public ResponseEntity<Void> addRecipeToCookbook(@PathVariable Long cookbookId, @RequestBody Map<String, Long> request) {
        Long recipeId = request.get("recipeId");
        cookbookService.addRecipeToCookbook(cookbookId, recipeId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{cookbookId}/recipes")
    public ResponseEntity<List<RecipeResponse>> getCookbookRecipes(@PathVariable Long cookbookId) {
        Cookbook cookbook = cookbookService.findById(cookbookId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Cookbook not found with id: %d", cookbookId)));
        
        // Récupérer les recettes via cookbookRecipes
        List<RecipeResponse> responses = cookbook.getCookbookRecipes().stream()
                .map(cookbookRecipe -> recipeMapper.toResponse(cookbookRecipe.getRecipe()))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{cookbookId}/members")
    public ResponseEntity<Void> addMemberToCookbook(
            @PathVariable Long cookbookId, 
            @RequestBody Map<String, String> request,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        String email = request.get("email");
        String permission = request.get("permission");
        
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User sender = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        Cookbook cookbook = cookbookService.findById(cookbookId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Cookbook not found with id: %d", cookbookId)));
        
        User receiver = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with email: %s", email)));
        
        // Vérifier si le membre existe déjà
        boolean memberExists = cookbook.getMembers().stream()
                .anyMatch(m -> m.getUser().getId().equals(receiver.getId()));
        
        if (memberExists) {
            throw new RuntimeException("User is already a member of this cookbook");
        }
        
        // Créer une invitation au lieu d'ajouter directement
        supmeal_backend.entity.CookbookInvitation invitation = supmeal_backend.entity.CookbookInvitation.builder()
                .sender(sender)
                .receiver(receiver)
                .cookbook(cookbook)
                .permission(supmeal_backend.entity.CookbookPermission.valueOf(permission))
                .status(supmeal_backend.entity.enums.InvitationStatus.PENDING)
                .sentAt(java.time.LocalDateTime.now())
                .build();
        
        cookbookInvitationService.save(invitation);
        
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{cookbookId}/members/{userId}")
    public ResponseEntity<Void> updateMemberPermission(
            @PathVariable Long cookbookId,
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String permission = request.get("permission");
        
        Cookbook cookbook = cookbookService.findById(cookbookId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Cookbook not found with id: %d", cookbookId)));
        
        CookbookMember member = cookbook.getMembers().stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Member not found with userId: %d", userId)));
        
        member.setPermission(supmeal_backend.entity.CookbookPermission.valueOf(permission));
        cookbookMemberService.update(member);
        
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cookbookId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long cookbookId,
            @PathVariable Long userId) {
        
        System.out.println("DELETE member - cookbookId: " + cookbookId + ", userId: " + userId);
        
        Cookbook cookbook = cookbookService.findById(cookbookId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Cookbook not found with id: %d", cookbookId)));
        
        // Charger les membres explicitement pour vérifier existence
        List<CookbookMember> members = cookbookMemberService.findByCookbook(cookbook);
        System.out.println("Members loaded: " + members.size());
        
        CookbookMember member = members.stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Member not found with userId: %d", userId)));
        
        System.out.println("Member found - CookbookMember ID: " + member.getId() + ", User ID: " + member.getUser().getId());
        
        // Supprimer directement par cookbookId et userId
        cookbookMemberRepository.deleteByCookbookIdAndUserId(cookbookId, userId);
        
        // Vérifier que le membre a bien été supprimé
        List<CookbookMember> remainingMembers = cookbookMemberService.findByCookbook(cookbook);
        System.out.println("Remaining members after deletion: " + remainingMembers.size());
        
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{cookbookId}/recipes/{recipeId}")
    public ResponseEntity<Void> removeRecipeFromCookbook(@PathVariable Long cookbookId, @PathVariable Long recipeId) {
        cookbookService.removeRecipeFromCookbook(cookbookId, recipeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CookbookResponse>> getAllCookbooks(@RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User currentUser = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        List<Cookbook> allCookbooks = cookbookService.findAll();
        
        // Filtrer les cookbooks: owner ou membre
        List<CookbookResponse> responses = allCookbooks.stream()
                .filter(cookbook -> {
                    // Owner
                    if (cookbook.getOwner() != null && cookbook.getOwner().getId().equals(currentUser.getId())) {
                        return true;
                    }
                    // Membre
                    if (cookbook.getMembers() != null) {
                        return cookbook.getMembers().stream()
                                .anyMatch(member -> member.getUser().getId().equals(currentUser.getId()));
                    }
                    return false;
                })
                .map(cookbookMapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CookbookResponse> getCookbookById(@PathVariable Long id) {
        Cookbook cookbook = cookbookService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Cookbook not found with id: %d", id)));
        return ResponseEntity.ok(cookbookMapper.toResponse(cookbook));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<CookbookResponse>> getCookbooksByOwner(@PathVariable Long ownerId) {
        List<Cookbook> cookbooks = cookbookService.findAll();
        List<CookbookResponse> responses = cookbooks.stream()
                .filter(c -> c.getOwner() != null && c.getOwner().getId().equals(ownerId))
                .map(cookbookMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CookbookResponse> updateCookbook(@PathVariable Long id, @Valid @RequestBody CookbookUpdateRequest request) {
        Cookbook existingCookbook = cookbookService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Cookbook not found with id: %d", id)));
        
        if (request.getName() != null) {
            existingCookbook.setName(request.getName());
        }
        if (request.getDescription() != null) {
            existingCookbook.setDescription(request.getDescription());
        }
        
        Cookbook updatedCookbook = cookbookService.update(existingCookbook);
        return ResponseEntity.ok(cookbookMapper.toResponse(updatedCookbook));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCookbook(@PathVariable Long id) {
        Cookbook cookbook = cookbookService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Cookbook not found with id: %d", id)));
        cookbookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
