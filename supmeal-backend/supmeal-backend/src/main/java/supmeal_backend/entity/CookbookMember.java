package supmeal_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cookbook_member")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CookbookMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CookbookPermission permission;

    @Column(nullable = false)
    private LocalDateTime joinedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cookbook_id", nullable = false)
    private Cookbook cookbook;
}