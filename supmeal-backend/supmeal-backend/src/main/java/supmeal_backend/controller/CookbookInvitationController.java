package supmeal_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.CookbookInvitationCreateRequest;
import supmeal_backend.dto.response.CookbookInvitationResponse;
import supmeal_backend.entity.Cookbook;
import supmeal_backend.entity.CookbookInvitation;
import supmeal_backend.entity.CookbookMember;
import supmeal_backend.entity.CookbookPermission;
import supmeal_backend.entity.User;
import supmeal_backend.entity.enums.InvitationStatus;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.CookbookInvitationMapper;
import supmeal_backend.service.CookbookInvitationService;
import supmeal_backend.service.CookbookMemberService;
import supmeal_backend.service.CookbookService;
import supmeal_backend.service.UserService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/cookbook-invitations")
@RequiredArgsConstructor
public class CookbookInvitationController {

    private final CookbookInvitationService cookbookInvitationService;
    private final CookbookInvitationMapper cookbookInvitationMapper;
    private final UserService userService;
    private final CookbookService cookbookService;
    private final CookbookMemberService cookbookMemberService;

    @PostMapping
    public ResponseEntity<CookbookInvitationResponse> createInvitation(
            @Valid @RequestBody CookbookInvitationCreateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;

        User sender = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));

        User receiver = userService.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", request.getReceiverId())));

        Cookbook cookbook = cookbookService.findById(request.getCookbookId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Cookbook not found with id: %d", request.getCookbookId())));

        // Vérifier si l'utilisateur est déjà membre
        boolean isAlreadyMember = cookbook.getMembers().stream()
                .anyMatch(member -> member.getUser().getId().equals(request.getReceiverId()));
        if (isAlreadyMember) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        // Vérifier si une invitation existe déjà
        boolean invitationExists = cookbookInvitationService.findByReceiverIdAndCookbookId(request.getReceiverId(), request.getCookbookId()).isPresent();
        if (invitationExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        CookbookInvitation invitation = CookbookInvitation.builder()
                .sender(sender)
                .receiver(receiver)
                .cookbook(cookbook)
                .permission(request.getPermission())
                .status(InvitationStatus.PENDING)
                .sentAt(LocalDateTime.now())
                .build();

        CookbookInvitation savedInvitation = cookbookInvitationService.save(invitation);
        return new ResponseEntity<>(cookbookInvitationMapper.toResponse(savedInvitation), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CookbookInvitationResponse>> getInvitationsForUser(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;

        List<CookbookInvitation> invitations = cookbookInvitationService.findByReceiverId(userId);
        List<CookbookInvitationResponse> responses = invitations.stream()
                .map(cookbookInvitationMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/sent")
    public ResponseEntity<List<CookbookInvitationResponse>> getSentInvitations(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;

        List<CookbookInvitation> invitations = cookbookInvitationService.findBySenderId(userId);
        List<CookbookInvitationResponse> responses = invitations.stream()
                .map(cookbookInvitationMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{invitationId}")
    public ResponseEntity<CookbookInvitationResponse> getInvitationById(
            @PathVariable Long invitationId,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;

        CookbookInvitation invitation = cookbookInvitationService.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        // Vérifier que l'utilisateur est le destinataire
        if (!invitation.getReceiver().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(cookbookInvitationMapper.toResponse(invitation));
    }

    @PostMapping("/{invitationId}/accept")
    public ResponseEntity<Void> acceptInvitation(
            @PathVariable Long invitationId,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;

        CookbookInvitation invitation = cookbookInvitationService.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        // Vérifier que l'utilisateur est le destinataire
        if (!invitation.getReceiver().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Vérifier que l'invitation est en attente
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // Créer le membre
        CookbookMember member = CookbookMember.builder()
                .cookbook(invitation.getCookbook())
                .user(invitation.getReceiver())
                .permission(invitation.getPermission())
                .joinedAt(LocalDateTime.now())
                .build();

        cookbookMemberService.save(member);

        // Mettre à jour le statut de l'invitation
        invitation.setStatus(InvitationStatus.ACCEPTED);
        cookbookInvitationService.update(invitation);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{invitationId}/decline")
    public ResponseEntity<Void> declineInvitation(
            @PathVariable Long invitationId,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;

        CookbookInvitation invitation = cookbookInvitationService.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        // Vérifier que l'utilisateur est le destinataire
        if (!invitation.getReceiver().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Vérifier que l'invitation est en attente
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // Mettre à jour le statut de l'invitation
        invitation.setStatus(InvitationStatus.DECLINED);
        cookbookInvitationService.update(invitation);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{invitationId}")
    public ResponseEntity<Void> deleteInvitation(
            @PathVariable Long invitationId,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;

        CookbookInvitation invitation = cookbookInvitationService.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        // Vérifier que l'utilisateur est l'expéditeur
        if (!invitation.getSender().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        cookbookInvitationService.delete(invitationId);
        return ResponseEntity.noContent().build();
    }
}
