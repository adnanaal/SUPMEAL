package supmeal_backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.MessageCreateRequest;
import supmeal_backend.dto.response.MessageResponse;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.Message;
import supmeal_backend.entity.User;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.MessageMapper;
import supmeal_backend.service.CookbookService;
import supmeal_backend.service.MessageService;
import supmeal_backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;
    private final MessageMapper messageMapper;
    private final UserService userService;
    private final CookbookService cookbookService;

    @PostMapping
    public ResponseEntity<MessageResponse> createMessage(@Valid @RequestBody MessageCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User sender = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with email: %s", email)));
        
        User receiver = userService.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Receiver not found with id: %d", request.getReceiverId())));
        
        Cookbook cookbook = cookbookService.findById(request.getCookbookId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Cookbook not found with id: %d", request.getCookbookId())));
        
        Message message = Message.builder()
                .content(request.getContent())
                .sender(sender)
                .receiver(receiver)
                .cookbook(cookbook)
                .build();
        
        Message savedMessage = messageService.save(message);
        return new ResponseEntity<>(messageMapper.toResponse(savedMessage), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getAllMessages() {
        List<Message> messages = messageService.findAll();
        List<MessageResponse> responses = messages.stream()
                .map(messageMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageResponse> getMessageById(@PathVariable Long id) {
        Message message = messageService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Message not found with id: %d", id)));
        return ResponseEntity.ok(messageMapper.toResponse(message));
    }

    @GetMapping("/cookbook/{cookbookId}")
    public ResponseEntity<List<MessageResponse>> getMessagesByCookbook(@PathVariable Long cookbookId) {
        List<Message> messages = messageService.findAll();
        List<MessageResponse> responses = messages.stream()
                .filter(m -> m.getCookbook() != null && m.getCookbook().getId().equals(cookbookId))
                .map(messageMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> updateMessage(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Message existingMessage = messageService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Message not found with id: %d", id)));
        
        if (request.get("content") != null) {
            existingMessage.setContent(request.get("content"));
        }
        
        Message updatedMessage = messageService.update(existingMessage);
        return ResponseEntity.ok(messageMapper.toResponse(updatedMessage));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        Message message = messageService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Message not found with id: %d", id)));
        messageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
