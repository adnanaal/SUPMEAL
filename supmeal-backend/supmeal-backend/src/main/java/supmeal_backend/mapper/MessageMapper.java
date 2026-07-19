package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.MessageCreateRequest;
import supmeal_backend.dto.response.MessageResponse;
import supmeal_backend.entity.Message;

@Component
public class MessageMapper {

    public MessageResponse toResponse(Message message) {
        if (message == null) {
            return null;
        }
        return MessageResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .senderFirstname(message.getSender() != null ? message.getSender().getFirstname() : null)
                .senderLastname(message.getSender() != null ? message.getSender().getLastname() : null)
                .receiverId(message.getReceiver() != null ? message.getReceiver().getId() : null)
                .cookbookId(message.getCookbook() != null ? message.getCookbook().getId() : null)
                .build();
    }

    public Message toEntity(MessageCreateRequest request) {
        if (request == null) {
            return null;
        }
        return Message.builder()
                .content(request.getContent())
                .build();
    }
}
