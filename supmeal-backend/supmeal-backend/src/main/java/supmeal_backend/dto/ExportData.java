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
public class ExportData {
    private String version;
    private String exportedAt;
    private UserData user;
    private List<RecipeExport> recipes;
    private List<CookbookExport> cookbooks;
}
