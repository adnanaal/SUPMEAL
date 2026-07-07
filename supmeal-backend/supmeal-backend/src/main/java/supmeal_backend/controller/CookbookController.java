package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.CookbookCreateRequest;
import supmeal_backend.dto.request.CookbookUpdateRequest;
import supmeal_backend.dto.response.CookbookResponse;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.User;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.CookbookMapper;
import supmeal_backend.service.CookbookService;
import supmeal_backend.service.UserService;

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
    private final UserService userService;

    @PostMapping
    public ResponseEntity<CookbookResponse> createCookbook(@Valid @RequestBody CookbookCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User owner = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with email: %s", email)));
        
        Cookbook cookbook = cookbookMapper.toEntity(request);
        cookbook.setOwner(owner);
        Cookbook savedCookbook = cookbookService.save(cookbook);
        return new ResponseEntity<>(cookbookMapper.toResponse(savedCookbook), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CookbookResponse>> getAllCookbooks() {
        List<Cookbook> cookbooks = cookbookService.findAll();
        List<CookbookResponse> responses = cookbooks.stream()
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
        
        Cookbook cookbook = cookbookMapper.toEntity(request);
        cookbook.setId(id);
        Cookbook updatedCookbook = cookbookService.update(cookbook);
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
