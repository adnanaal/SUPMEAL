package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.*;
import supmeal_backend.entity.enums.NotificationType;
import supmeal_backend.repository.MessageRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final NotificationService notificationService;
    private final CookbookService cookbookService;

    public Message save(Message message) {
        Message savedMessage = messageRepository.save(message);
        
        // Créer une notification pour tous les membres du cookbook
        if (message.getCookbook() != null) {
            Cookbook cookbook = cookbookService.findById(message.getCookbook().getId())
                    .orElse(null);
            
            if (cookbook != null && cookbook.getMembers() != null) {
                for (CookbookMember member : cookbook.getMembers()) {
                    // Ne pas notifier l'auteur du message
                    if (!member.getUser().getId().equals(message.getSender().getId())) {
                        Notification notification = Notification.builder()
                                .type(NotificationType.COOKBOOK_MESSAGE)
                                .title("New message in cookbook discussion")
                                .message(message.getSender().getFirstname() + " " + message.getSender().getLastname() + 
                                        " sent a message in " + cookbook.getName())
                                .user(member.getUser())
                                .cookbook(cookbook)
                                .messageEntity(savedMessage)
                                .link("/dashboard/cookbooks/" + cookbook.getId())
                                .build();
                        notificationService.save(notification);
                    }
                }
            }
        }
        
        return savedMessage;
    }

    public List<Message> findAll() {
        return messageRepository.findAll();
    }

    public Optional<Message> findById(Long id) {
        return messageRepository.findById(id);
    }

    public List<Message> findBySender(User sender) {
        return messageRepository.findBySender(sender);
    }

    public List<Message> findByReceiver(User receiver) {
        return messageRepository.findByReceiver(receiver);
    }

    public Message update(Message message) {
        return messageRepository.save(message);
    }

    public void delete(Long id) {
        messageRepository.deleteById(id);
    }
}
