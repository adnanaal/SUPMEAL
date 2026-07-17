package supmeal_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import supmeal_backend.entity.enums.MealType;

import java.time.LocalDate;

@Entity
@Table(name = "shopping_list_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shopping_list_id", nullable = false)
    private ShoppingList shoppingList;

    @Column(nullable = false)
    private String ingredientName;

    @Column(nullable = false)
    private String quantity;

    @Column(nullable = false)
    private String unit;

    @Builder.Default
    @Column(nullable = false)
    private Boolean checked = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_meal_plan_id")
    private MealPlanning sourceMealPlan;

    private String sourceRecipeTitle;

    @Enumerated(EnumType.STRING)
    private MealType sourceMealType;

    private LocalDate sourceDate;
}
