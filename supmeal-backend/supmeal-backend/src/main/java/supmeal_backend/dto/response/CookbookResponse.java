package supmeal_backend.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CookbookResponse {

    private Long id;

    private String name;

    private String description;

    private Long ownerId;

    private String ownerFirstname;

    private String ownerLastname;

    private String coverImage;

    private List<Long> recipeIds;

    private List<CookbookMemberResponse> members;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
