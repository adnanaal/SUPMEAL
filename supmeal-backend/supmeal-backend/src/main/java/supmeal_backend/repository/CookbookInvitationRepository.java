package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import supmeal_backend.entity.CookbookInvitation;
import supmeal_backend.entity.User;

import java.util.List;

public interface CookbookInvitationRepository extends JpaRepository<CookbookInvitation, Long> {

    List<CookbookInvitation> findByReceiver(User receiver);

    List<CookbookInvitation> findBySender(User sender);

}