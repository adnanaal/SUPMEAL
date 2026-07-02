package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.CookbookDTO;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.CookbookMapper;
import supmeal_backend.service.CookbookService;

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

    @PostMapping
    public ResponseEntity<CookbookDTO> createCookbook(@Valid @RequestBody CookbookDTO cookbookDTO) {
        Cookbook cookbook = cookbookMapper.toEntity(cookbookDTO);
        Cookbook savedCookbook = cookbookService.save(cookbook);
        return new ResponseEntity<>(cookbookMapper.toDTO(savedCookbook), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CookbookDTO>> getAllCookbooks() {
        List<Cookbook> cookbooks = cookbookService.findAll();
        List<CookbookDTO> cookbookDTOs = cookbooks.stream()
                .map(cookbookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(cookbookDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CookbookDTO> getCookbookById(@PathVariable Long id) {
        Cookbook cookbook = cookbookService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cookbook", id));
        return ResponseEntity.ok(cookbookMapper.toDTO(cookbook));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<CookbookDTO>> getCookbooksByOwner(@PathVariable Long ownerId) {
        List<Cookbook> cookbooks = cookbookService.findAll();
        List<CookbookDTO> cookbookDTOs = cookbooks.stream()
                .filter(c -> c.getOwner() != null && c.getOwner().getId().equals(ownerId))
                .map(cookbookMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(cookbookDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CookbookDTO> updateCookbook(@PathVariable Long id, @Valid @RequestBody CookbookDTO cookbookDTO) {
        Cookbook existingCookbook = cookbookService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cookbook", id));
        
        Cookbook cookbook = cookbookMapper.toEntity(cookbookDTO);
        cookbook.setId(id);
        Cookbook updatedCookbook = cookbookService.update(cookbook);
        return ResponseEntity.ok(cookbookMapper.toDTO(updatedCookbook));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCookbook(@PathVariable Long id) {
        Cookbook cookbook = cookbookService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cookbook", id));
        cookbookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
