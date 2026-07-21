package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.CookbookInvitation;
import supmeal_backend.repository.CookbookInvitationRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CookbookInvitationService {

    private final CookbookInvitationRepository cookbookInvitationRepository;

    public CookbookInvitation save(CookbookInvitation invitation) {
        return cookbookInvitationRepository.save(invitation);
    }

    public List<CookbookInvitation> findAll() {
        return cookbookInvitationRepository.findAll();
    }

    public Optional<CookbookInvitation> findById(Long id) {
        return cookbookInvitationRepository.findById(id);
    }

    public List<CookbookInvitation> findByReceiverId(Long receiverId) {
        return cookbookInvitationRepository.findByReceiverId(receiverId);
    }

    public List<CookbookInvitation> findBySenderId(Long senderId) {
        return cookbookInvitationRepository.findBySenderId(senderId);
    }

    public Optional<CookbookInvitation> findByReceiverIdAndCookbookId(Long receiverId, Long cookbookId) {
        return cookbookInvitationRepository.findByReceiverIdAndCookbookId(receiverId, cookbookId);
    }

    public CookbookInvitation update(CookbookInvitation invitation) {
        return cookbookInvitationRepository.save(invitation);
    }

    public void delete(Long id) {
        cookbookInvitationRepository.deleteById(id);
    }
}
