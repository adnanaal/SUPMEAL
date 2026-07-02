package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.CookbookMember;
import supmeal_backend.entity.User;
import supmeal_backend.repository.CookbookMemberRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CookbookMemberService {

    private final CookbookMemberRepository cookbookMemberRepository;

    public CookbookMember save(CookbookMember member) {
        return cookbookMemberRepository.save(member);
    }

    public List<CookbookMember> findAll() {
        return cookbookMemberRepository.findAll();
    }

    public Optional<CookbookMember> findById(Long id) {
        return cookbookMemberRepository.findById(id);
    }

    public List<CookbookMember> findByCookbook(Cookbook cookbook) {
        return cookbookMemberRepository.findByCookbook(cookbook);
    }

    public List<CookbookMember> findByUser(User user) {
        return cookbookMemberRepository.findByUser(user);
    }

    public CookbookMember update(CookbookMember member) {
        return cookbookMemberRepository.save(member);
    }

    public void delete(Long id) {
        cookbookMemberRepository.deleteById(id);
    }
}
