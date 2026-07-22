package supmeal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CookbookExport {
    private Long id;
    private String name;
    private String description;
    private String coverImage;
    private List<Long> recipeIds;
    private List<CookbookMemberExport> members;
}
