package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.*;
import supmeal_backend.entity.enums.NotificationType;
import supmeal_backend.repository.CommentRepository;
import supmeal_backend.repository.CookbookRecipeRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final NotificationService notificationService;
    private final CookbookService cookbookService;
    private final CookbookRecipeRepository cookbookRecipeRepository;

    public Comment save(Comment comment) {
        Comment savedComment = commentRepository.save(comment);
        
        // Créer une notification pour tous les membres du cookbook
        if (comment.getRecipe() != null) {
            // Récupérer le cookbook via CookbookRecipe
            List<CookbookRecipe> cookbookRecipes = cookbookRecipeRepository.findByRecipe(comment.getRecipe());
            
            for (CookbookRecipe cookbookRecipe : cookbookRecipes) {
                Cookbook cookbook = cookbookRecipe.getCookbook();
                
                if (cookbook != null && cookbook.getMembers() != null) {
                    for (CookbookMember member : cookbook.getMembers()) {
                        // Ne pas notifier l'auteur du commentaire
                        if (!member.getUser().getId().equals(comment.getUser().getId())) {
                            Notification notification = Notification.builder()
                                    .type(NotificationType.RECIPE_COMMENT)
                                    .title("New comment on recipe")
                                    .message(comment.getUser().getFirstname() + " " + comment.getUser().getLastname() + 
                                            " commented on " + comment.getRecipe().getTitle())
                                    .user(member.getUser())
                                    .cookbook(cookbook)
                                    .recipe(comment.getRecipe())
                                    .comment(savedComment)
                                    .link("/dashboard/cookbooks/" + cookbook.getId())
                                    .build();
                            notificationService.save(notification);
                        }
                    }
                }
            }
        }
        
        return savedComment;
    }

    public List<Comment> findAll() {
        return commentRepository.findAll();
    }

    public Optional<Comment> findById(Long id) {
        return commentRepository.findById(id);
    }

    public List<Comment> findByRecipe(Recipe recipe) {
        return commentRepository.findByRecipe(recipe);
    }

    public Comment update(Comment comment) {
        return commentRepository.save(comment);
    }

    public void delete(Long id) {
        commentRepository.deleteById(id);
    }
}
