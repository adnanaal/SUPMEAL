package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.response.NotificationResponse;
import supmeal_backend.entity.User;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.NotificationMapper;
import supmeal_backend.service.NotificationService;
import supmeal_backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotificationsForUser(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;

        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));

        List<NotificationResponse> responses = notificationService.findByUserOrderByCreatedAtDesc(user).stream()
                .map(notificationMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        var notification = notificationService.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setIsRead(true);
        notificationService.update(notification);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.delete(notificationId);
        return ResponseEntity.noContent().build();
    }
}
