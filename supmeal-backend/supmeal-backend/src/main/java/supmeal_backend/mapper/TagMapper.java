package supmeal_backend.dto.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.TagDTO;
import supmeal_backend.entity.Tag;

@Component
public class TagMapper {

    public TagDTO toDTO(Tag tag) {
        if (tag == null) {
            return null;
        }
        return TagDTO.builder()
                .id(tag.getId())
                .name(tag.getName())
                .createdAt(tag.getCreatedAt())
                .recipeId(tag.getRecipe() != null ? tag.getRecipe().getId() : null)
                .build();
    }

    public Tag toEntity(TagDTO tagDTO) {
        if (tagDTO == null) {
            return null;
        }
        return Tag.builder()
                .id(tagDTO.getId())
                .name(tagDTO.getName())
                .createdAt(tagDTO.getCreatedAt())
                .build();
    }
}
