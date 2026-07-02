package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.MessageDTO;
import supmeal_backend.entity.Message;

@Component
public class MessageMapper {

    public MessageDTO toDTO(Message message) {
        if (message == null) {
            return null;
        }
        return MessageDTO.builder()
                .id(message.getId())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .receiverId(message.getReceiver() != null ? message.getReceiver().getId() : null)
                .cookbookId(message.getCookbook() != null ? message.getCookbook().getId() : null)
                .build();
    }

    public Message toEntity(MessageDTO messageDTO) {
        if (messageDTO == null) {
            return null;
        }
        return Message.builder()
                .id(messageDTO.getId())
                .content(messageDTO.getContent())
                .createdAt(messageDTO.getCreatedAt())
                .build();
    }
}
