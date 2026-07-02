package supmeal_backend.dto.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.CookbookDTO;
import supmeal_backend.entity.Cookbook;

@Component
public class CookbookMapper {

    public CookbookDTO toDTO(Cookbook cookbook) {
        if (cookbook == null) {
            return null;
        }
        return CookbookDTO.builder()
                .id(cookbook.getId())
                .name(cookbook.getName())
                .description(cookbook.getDescription())
                .ownerId(cookbook.getOwner() != null ? cookbook.getOwner().getId() : null)
                .createdAt(cookbook.getCreatedAt())
                .updatedAt(cookbook.getUpdatedAt())
                .build();
    }

    public Cookbook toEntity(CookbookDTO cookbookDTO) {
        if (cookbookDTO == null) {
            return null;
        }
        return Cookbook.builder()
                .id(cookbookDTO.getId())
                .name(cookbookDTO.getName())
                .description(cookbookDTO.getDescription())
                .createdAt(cookbookDTO.getCreatedAt())
                .updatedAt(cookbookDTO.getUpdatedAt())
                .build();
    }
}
