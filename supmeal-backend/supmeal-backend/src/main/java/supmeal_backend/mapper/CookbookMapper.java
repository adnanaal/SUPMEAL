package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.CookbookCreateRequest;
import supmeal_backend.dto.request.CookbookUpdateRequest;
import supmeal_backend.dto.response.CookbookMemberResponse;
import supmeal_backend.dto.response.CookbookResponse;
import supmeal_backend.entity.Cookbook;

@Component
public class CookbookMapper {

    public CookbookResponse toResponse(Cookbook cookbook) {
        if (cookbook == null) {
            return null;
        }
        System.out.println("Cookbook ID: " + cookbook.getId());
        System.out.println("Members count: " + (cookbook.getMembers() != null ? cookbook.getMembers().size() : 0));
        
        return CookbookResponse.builder()
                .id(cookbook.getId())
                .name(cookbook.getName())
                .description(cookbook.getDescription())
                .ownerId(cookbook.getOwner() != null ? cookbook.getOwner().getId() : null)
                .ownerFirstname(cookbook.getOwner() != null ? cookbook.getOwner().getFirstname() : null)
                .ownerLastname(cookbook.getOwner() != null ? cookbook.getOwner().getLastname() : null)
                .coverImage(cookbook.getCoverImage())
                .recipeIds(cookbook.getCookbookRecipes() != null ? 
                    cookbook.getCookbookRecipes().stream()
                        .map(cr -> cr.getRecipe().getId())
                        .toList() : null)
                .members(cookbook.getMembers() != null ?
                    cookbook.getMembers().stream()
                        .map(m -> {
                            System.out.println("Member: userId=" + (m.getUser() != null ? m.getUser().getId() : null) + ", permission=" + m.getPermission());
                            return CookbookMemberResponse.builder()
                                .id(m.getId())
                                .userId(m.getUser() != null ? m.getUser().getId() : null)
                                .userName(m.getUser() != null ? m.getUser().getFirstname() + " " + m.getUser().getLastname() : null)
                                .userEmail(m.getUser() != null ? m.getUser().getEmail() : null)
                                .cookbookId(m.getCookbook() != null ? m.getCookbook().getId() : null)
                                .permission(m.getPermission() != null ? m.getPermission().toString() : null)
                                .joinedAt(m.getJoinedAt())
                                .build();
                        })
                        .toList() : null)
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
                .coverImage(request.getCoverImage())
                .build();
    }

    public Cookbook toEntity(CookbookUpdateRequest request) {
        if (request == null) {
            return null;
        }
        return Cookbook.builder()
                .name(request.getName())
                .description(request.getDescription())
                .coverImage(request.getCoverImage())
                .build();
    }
}
