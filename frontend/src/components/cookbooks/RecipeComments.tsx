'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { RecipeComment } from '@/lib/localMessages';
import { getRecipeComments, addRecipeComment, updateRecipeComment, deleteRecipeComment } from '@/lib/localMessages';
import { getCookbookById } from '@/lib/localCookbooks';
import { createRecipeCommentNotification } from '@/lib/localNotifications';
import { User } from '@/types';

interface RecipeCommentsProps {
  cookbookId: number;
  recipeId: number;
  recipeTitle: string;
  currentUser: User;
}

export function RecipeComments({ cookbookId, recipeId, recipeTitle, currentUser }: RecipeCommentsProps) {
  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Charger les commentaires
  useEffect(() => {
    const loadComments = () => {
      setComments(getRecipeComments(cookbookId, recipeId));
    };

    loadComments();
  }, [cookbookId, recipeId]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = addRecipeComment({
        content: newComment,
        cookbookId,
        recipeId,
        userId: currentUser.id,
        user: currentUser,
      });
      setComments([...comments, comment]);
      setNewComment('');

      // Générer une notification pour les autres membres du cookbook
      const cookbook = getCookbookById(cookbookId);
      if (cookbook) {
        cookbook.members.forEach((member) => {
          if (member.userId !== String(currentUser.id)) {
            // Simuler l'ID utilisateur (sera remplacé par l'authentification réelle)
            const memberUserId = parseInt(member.userId);
            createRecipeCommentNotification(
              memberUserId,
              cookbookId,
              recipeId,
              recipeTitle,
              `${currentUser.firstname} ${currentUser.lastname}`,
              comment.id
            );
          }
        });
      }
    }
  };

  const handleEditComment = (commentId: number) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditContent(comment.content);
    }
  };

  const handleSaveEdit = () => {
    if (editingCommentId && editContent.trim()) {
      const updatedComment = updateRecipeComment(editingCommentId, editContent);
      if (updatedComment) {
        setComments(comments.map((c) => (c.id === editingCommentId ? updatedComment : c)));
      }
      setEditingCommentId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      const success = deleteRecipeComment(commentId);
      if (success) {
        setComments(comments.filter((c) => c.id !== commentId));
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const isOwnComment = (comment: RecipeComment) => comment.userId === currentUser.id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
          <span className="ml-2 text-sm text-gray-500">({comments.length})</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Comments */}
      {isExpanded && (
        <div className="p-4">
          <div className="space-y-4 mb-4">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <MessageSquare className="w-8 h-8 mb-2 text-gray-300" />
                <p className="text-sm">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-lg ${
                    isOwnComment(comment) ? 'bg-orange-50 border border-orange-100' : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  {/* User info */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {comment.user?.avatar ? (
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.firstname}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center mr-2">
                          <span className="text-xs text-orange-700 font-medium">
                            {comment.user?.firstname?.[0] || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {comment.user?.firstname} {comment.user?.lastname}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatTime(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                    {isOwnComment(comment) && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="text-xs p-1 hover:bg-gray-200 rounded text-gray-600"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-xs p-1 hover:bg-gray-200 rounded text-gray-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Comment content */}
                  {editingCommentId === comment.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-xs px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add comment input */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
