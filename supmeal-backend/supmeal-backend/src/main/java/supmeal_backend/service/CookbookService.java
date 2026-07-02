package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.User;
import supmeal_backend.repository.CookbookRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CookbookService {

    private final CookbookRepository cookbookRepository;

    public Cookbook save(Cookbook cookbook) {
        return cookbookRepository.save(cookbook);
    }

    public List<Cookbook> findAll() {
        return cookbookRepository.findAll();
    }

    public Optional<Cookbook> findById(Long id) {
        return cookbookRepository.findById(id);
    }

    public List<Cookbook> findByOwner(User owner) {
        return cookbookRepository.findByOwner(owner);
    }

    public Cookbook update(Cookbook cookbook) {
        return cookbookRepository.save(cookbook);
    }

    public void delete(Long id) {
        cookbookRepository.deleteById(id);
    }
}
