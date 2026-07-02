package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.NotificationDTO;
import supmeal_backend.entity.Notification;

@Component
public class NotificationMapper {

    public NotificationDTO toDTO(Notification notification) {
        if (notification == null) {
            return null;
        }
        return NotificationDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .userId(notification.getUser() != null ? notification.getUser().getId() : null)
                .build();
    }

    public Notification toEntity(NotificationDTO notificationDTO) {
        if (notificationDTO == null) {
            return null;
        }
        return Notification.builder()
                .id(notificationDTO.getId())
                .title(notificationDTO.getTitle())
                .message(notificationDTO.getMessage())
                .isRead(notificationDTO.getIsRead())
                .createdAt(notificationDTO.getCreatedAt())
                .build();
    }
}
