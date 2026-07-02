package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.CookbookMember;
import supmeal_backend.entity.User;

import java.util.List;

public interface CookbookMemberRepository extends JpaRepository<CookbookMember, Long> {

    List<CookbookMember> findByCookbook(Cookbook cookbook);

    List<CookbookMember> findByUser(User user);

}