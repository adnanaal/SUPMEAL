package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.CookbookMember;
import supmeal_backend.entity.User;

import java.util.List;

public interface CookbookMemberRepository extends JpaRepository<CookbookMember, Long> {

    List<CookbookMember> findByCookbook(Cookbook cookbook);

    List<CookbookMember> findByUser(User user);

    @Modifying
    @Transactional
    @Query("DELETE FROM CookbookMember cm WHERE cm.cookbook.id = :cookbookId AND cm.user.id = :userId")
    void deleteByCookbookIdAndUserId(@Param("cookbookId") Long cookbookId, @Param("userId") Long userId);

}