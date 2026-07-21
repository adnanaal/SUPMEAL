package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.NotificationCreateRequest;
import supmeal_backend.dto.response.NotificationResponse;
import supmeal_backend.entity.Notification;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {
        if (notification == null) {
            return null;
        }
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType() != null ? notification.getType().name() : null)
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .cookbookId(notification.getCookbook() != null ? notification.getCookbook().getId() : null)
                .cookbookName(notification.getCookbook() != null ? notification.getCookbook().getName() : null)
                .recipeId(notification.getRecipe() != null ? notification.getRecipe().getId() : null)
                .recipeName(notification.getRecipe() != null ? notification.getRecipe().getTitle() : null)
                .messageId(notification.getMessageEntity() != null ? notification.getMessageEntity().getId() : null)
                .commentId(notification.getComment() != null ? notification.getComment().getId() : null)
                .link(notification.getLink())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    public Notification toEntity(NotificationCreateRequest request) {
        if (request == null) {
            return null;
        }
        return Notification.builder()
                .title(request.getTitle())
                .message(request.getMessage())
                .build();
    }
}
