package supmeal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CookbookMemberDTO {
    private Long id;
    private LocalDateTime joinedAt;
    private Long userId;
    private Long cookbookId;
}
