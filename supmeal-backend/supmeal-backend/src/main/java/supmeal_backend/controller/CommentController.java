package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.CommentDTO;
import supmeal_backend.entity.Comment;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.CommentMapper;
import supmeal_backend.service.CommentService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;
    private final CommentMapper commentMapper;

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@Valid @RequestBody CommentDTO commentDTO) {
        Comment comment = commentMapper.toEntity(commentDTO);
        Comment savedComment = commentService.save(comment);
        return new ResponseEntity<>(commentMapper.toDTO(savedComment), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getAllComments() {
        List<Comment> comments = commentService.findAll();
        List<CommentDTO> commentDTOs = comments.stream()
                .map(commentMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commentDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Long id) {
        Comment comment = commentService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
        return ResponseEntity.ok(commentMapper.toDTO(comment));
    }

    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByRecipe(@PathVariable Long recipeId) {
        List<Comment> comments = commentService.findAll();
        List<CommentDTO> commentDTOs = comments.stream()
                .filter(c -> c.getRecipe() != null && c.getRecipe().getId().equals(recipeId))
                .map(commentMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commentDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable Long id, @Valid @RequestBody CommentDTO commentDTO) {
        Comment existingComment = commentService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
        
        Comment comment = commentMapper.toEntity(commentDTO);
        comment.setId(id);
        Comment updatedComment = commentService.update(comment);
        return ResponseEntity.ok(commentMapper.toDTO(updatedComment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        Comment comment = commentService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
