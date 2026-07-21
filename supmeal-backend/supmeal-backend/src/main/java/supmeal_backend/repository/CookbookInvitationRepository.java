package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import supmeal_backend.entity.CookbookInvitation;
import supmeal_backend.entity.User;

import java.util.List;
import java.util.Optional;

public interface CookbookInvitationRepository extends JpaRepository<CookbookInvitation, Long> {

    List<CookbookInvitation> findByReceiverId(Long receiverId);

    List<CookbookInvitation> findBySenderId(Long senderId);

    Optional<CookbookInvitation> findByReceiverIdAndCookbookId(Long receiverId, Long cookbookId);

}