package supmeal_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cookbook_recipes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"cookbook_id", "recipe_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CookbookRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cookbook_id", nullable = false)
    private Cookbook cookbook;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by_user_id")
    private User addedBy;

    private LocalDateTime addedAt;

    @PrePersist
    public void onCreate() {
        addedAt = LocalDateTime.now();
    }
}
