package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.CookbookCreateRequest;
import supmeal_backend.dto.request.CookbookUpdateRequest;
import supmeal_backend.dto.response.CookbookResponse;
import supmeal_backend.entity.Cookbook;

@Component
public class CookbookMapper {

    public CookbookResponse toResponse(Cookbook cookbook) {
        if (cookbook == null) {
            return null;
        }
        return CookbookResponse.builder()
                .id(cookbook.getId())
                .name(cookbook.getName())
                .description(cookbook.getDescription())
                .ownerId(cookbook.getOwner() != null ? cookbook.getOwner().getId() : null)
                .createdAt(cookbook.getCreatedAt())
                .updatedAt(cookbook.getUpdatedAt())
                .build();
    }

    public Cookbook toEntity(CookbookCreateRequest request) {
        if (request == null) {
            return null;
        }
        return Cookbook.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public Cookbook toEntity(CookbookUpdateRequest request) {
        if (request == null) {
            return null;
        }
        return Cookbook.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }
}
