package supmeal_backend.dto.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.CookbookMemberDTO;
import supmeal_backend.entity.CookbookMember;

@Component
public class CookbookMemberMapper {

    public CookbookMemberDTO toDTO(CookbookMember member) {
        if (member == null) {
            return null;
        }
        return CookbookMemberDTO.builder()
                .id(member.getId())
                .joinedAt(member.getJoinedAt())
                .userId(member.getUser() != null ? member.getUser().getId() : null)
                .cookbookId(member.getCookbook() != null ? member.getCookbook().getId() : null)
                .build();
    }

    public CookbookMember toEntity(CookbookMemberDTO memberDTO) {
        if (memberDTO == null) {
            return null;
        }
        return CookbookMember.builder()
                .id(memberDTO.getId())
                .joinedAt(memberDTO.getJoinedAt())
                .build();
    }
}
