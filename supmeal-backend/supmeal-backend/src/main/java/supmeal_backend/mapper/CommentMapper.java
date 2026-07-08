package supmeal_backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.CommentCreateRequest;
import supmeal_backend.dto.request.CommentUpdateRequest;
import supmeal_backend.dto.response.CommentResponse;
import supmeal_backend.entity.Comment;
import supmeal_backend.entity.Recipe;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.repository.RecipeRepository;

@Component
@RequiredArgsConstructor
public class CommentMapper {

    private final RecipeRepository recipeRepository;

    public CommentResponse toResponse(Comment comment) {
        if (comment == null) {
            return null;
        }
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .userId(comment.getUser() != null ? comment.getUser().getId() : null)
                .recipeId(comment.getRecipe() != null ? comment.getRecipe().getId() : null)
                .build();
    }

    public Comment toEntity(CommentCreateRequest request) {
        if (request == null) {
            return null;
        }
        Comment comment = Comment.builder()
                .content(request.getContent())
                .build();
        
        if (request.getRecipeId() != null) {
            Recipe recipe = recipeRepository.findById(request.getRecipeId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Recipe not found with id: %d", request.getRecipeId())));
            comment.setRecipe(recipe);
        }
        
        return comment;
    }

    public Comment toEntity(CommentUpdateRequest request) {
        if (request == null) {
            return null;
        }
        return Comment.builder()
                .content(request.getContent())
                .build();
    }
}
