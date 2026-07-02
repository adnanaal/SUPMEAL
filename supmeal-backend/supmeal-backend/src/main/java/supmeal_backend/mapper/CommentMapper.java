package supmeal_backend.dto.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.CommentDTO;
import supmeal_backend.entity.Comment;

@Component
public class CommentMapper {

    public CommentDTO toDTO(Comment comment) {
        if (comment == null) {
            return null;
        }
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .userId(comment.getUser() != null ? comment.getUser().getId() : null)
                .recipeId(comment.getRecipe() != null ? comment.getRecipe().getId() : null)
                .build();
    }

    public Comment toEntity(CommentDTO commentDTO) {
        if (commentDTO == null) {
            return null;
        }
        return Comment.builder()
                .id(commentDTO.getId())
                .content(commentDTO.getContent())
                .createdAt(commentDTO.getCreatedAt())
                .build();
    }
}
