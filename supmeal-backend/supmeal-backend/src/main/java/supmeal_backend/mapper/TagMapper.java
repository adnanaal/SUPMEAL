package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.TagCreateRequest;
import supmeal_backend.dto.response.TagResponse;
import supmeal_backend.entity.Tag;

@Component
public class TagMapper {

    public TagResponse toResponse(Tag tag) {
        if (tag == null) {
            return null;
        }
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .createdAt(tag.getCreatedAt())
                .build();
    }

    public Tag toEntity(TagCreateRequest request) {
        if (request == null) {
            return null;
        }
        return Tag.builder()
                .name(request.getName())
                .build();
    }
}
