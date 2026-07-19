'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Comment } from '@/types';
import { commentService } from '@/services/commentService';
import { User } from '@/types';

interface RecipeCommentsProps {
  cookbookId: number;
  recipeId: number;
  recipeTitle: string;
  currentUser: User;
  userPermission?: string;
}

export function RecipeComments({ cookbookId, recipeId, recipeTitle, currentUser, userPermission }: RecipeCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [updatedComment, setUpdatedComment] = useState('');

  const canComment = userPermission === 'OWNER' || userPermission === 'EDITOR' || userPermission === 'COMMENTATOR';

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await commentService.getCommentsByRecipe(recipeId);
        setComments(data);
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    };
    loadComments();
  }, [recipeId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const comment = await commentService.createComment({
        content: newComment,
        recipeId
      });
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!updatedComment.trim()) return;
    
    try {
      const updated = await commentService.updateComment(commentId, {
        content: updatedComment
      });
      setComments(comments.map(c => c.id === commentId ? updated : c));
      setEditingComment(null);
      setUpdatedComment('');
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">{comments.length}</span>
      </div>

      {/* Add Comment */}
      <div className="mb-6">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            disabled={!canComment}
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!canComment}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {comment.user?.firstname} {comment.user?.lastname}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {editingComment === comment.id ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={updatedComment}
                        onChange={(e) => setUpdatedComment(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingComment(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-900">{comment.content}</p>
                  )}
                </div>
                {comment.userId === currentUser.id && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingComment(comment.id);
                        setUpdatedComment(comment.content);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
