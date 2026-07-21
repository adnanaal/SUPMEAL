package supmeal_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import supmeal_backend.entity.CookbookPermission;
import supmeal_backend.entity.enums.InvitationStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "cookbook_invitation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CookbookInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CookbookPermission permission;

    @Column(nullable = false)
    private LocalDateTime sentAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cookbook_id", nullable = false)
    private Cookbook cookbook;
}