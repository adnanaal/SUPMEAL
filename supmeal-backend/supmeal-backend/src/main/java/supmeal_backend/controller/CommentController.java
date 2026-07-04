package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.CommentCreateRequest;
import supmeal_backend.dto.request.CommentUpdateRequest;
import supmeal_backend.dto.response.CommentResponse;
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
    public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CommentCreateRequest request) {
        Comment comment = commentMapper.toEntity(request);
        Comment savedComment = commentService.save(comment);
        return new ResponseEntity<>(commentMapper.toResponse(savedComment), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getAllComments() {
        List<Comment> comments = commentService.findAll();
        List<CommentResponse> responses = comments.stream()
                .map(commentMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponse> getCommentById(@PathVariable Long id) {
        Comment comment = commentService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
        return ResponseEntity.ok(commentMapper.toResponse(comment));
    }

    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByRecipe(@PathVariable Long recipeId) {
        List<Comment> comments = commentService.findAll();
        List<CommentResponse> responses = comments.stream()
                .filter(c -> c.getRecipe() != null && c.getRecipe().getId().equals(recipeId))
                .map(commentMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long id, @Valid @RequestBody CommentUpdateRequest request) {
        Comment existingComment = commentService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
        
        Comment comment = commentMapper.toEntity(request);
        comment.setId(id);
        Comment updatedComment = commentService.update(comment);
        return ResponseEntity.ok(commentMapper.toResponse(updatedComment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        Comment comment = commentService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
