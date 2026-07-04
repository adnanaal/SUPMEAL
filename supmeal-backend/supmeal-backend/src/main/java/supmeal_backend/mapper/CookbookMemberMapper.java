package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.CookbookMemberCreateRequest;
import supmeal_backend.dto.response.CookbookMemberResponse;
import supmeal_backend.entity.CookbookMember;

@Component
public class CookbookMemberMapper {

    public CookbookMemberResponse toResponse(CookbookMember member) {
        if (member == null) {
            return null;
        }
        return CookbookMemberResponse.builder()
                .id(member.getId())
                .joinedAt(member.getJoinedAt())
                .userId(member.getUser() != null ? member.getUser().getId() : null)
                .cookbookId(member.getCookbook() != null ? member.getCookbook().getId() : null)
                .build();
    }

    public CookbookMember toEntity(CookbookMemberCreateRequest request) {
        if (request == null) {
            return null;
        }
        return CookbookMember.builder()
                .build();
    }
}
