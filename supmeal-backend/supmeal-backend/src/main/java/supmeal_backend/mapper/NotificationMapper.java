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
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
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
