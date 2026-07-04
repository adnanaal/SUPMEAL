package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.CommentCreateRequest;
import supmeal_backend.dto.request.CommentUpdateRequest;
import supmeal_backend.dto.response.CommentResponse;
import supmeal_backend.entity.Comment;

@Component
public class CommentMapper {

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
        return Comment.builder()
                .content(request.getContent())
                .build();
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
