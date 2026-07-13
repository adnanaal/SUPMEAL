'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Edit2, Trash2, MessageSquare, X } from 'lucide-react';
import { CookbookMessage } from '@/lib/localMessages';
import { getCookbookMessages, addCookbookMessage, updateCookbookMessage, deleteCookbookMessage } from '@/lib/localMessages';
import { getCookbookById } from '@/lib/localCookbooks';
import { createCookbookMessageNotification } from '@/lib/localNotifications';
import { User } from '@/types';

interface CookbookMessagingProps {
  cookbookId: number;
  currentUser: User;
}

export function CookbookMessaging({ cookbookId, currentUser }: CookbookMessagingProps) {
  const [messages, setMessages] = useState<CookbookMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger les messages
  useEffect(() => {
    const loadMessages = () => {
      setMessages(getCookbookMessages(cookbookId));
    };

    loadMessages();

    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    scrollToBottom();
  }, [cookbookId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = addCookbookMessage({
        content: newMessage,
        cookbookId,
        userId: currentUser.id,
        user: currentUser,
      });
      setMessages([...messages, message]);
      setNewMessage('');
      scrollToBottom();

      // Générer une notification pour les autres membres du cookbook
      const cookbook = getCookbookById(cookbookId);
      if (cookbook) {
        cookbook.members.forEach((member) => {
          if (member.userId !== String(currentUser.id)) {
            // Simuler l'ID utilisateur (sera remplacé par l'authentification réelle)
            const memberUserId = parseInt(member.userId);
            createCookbookMessageNotification(
              memberUserId,
              cookbookId,
              cookbook.name,
              `${currentUser.firstname} ${currentUser.lastname}`,
              message.id
            );
          }
        });
      }
    }
  };

  const handleEditMessage = (messageId: number) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      setEditingMessageId(messageId);
      setEditContent(message.content);
    }
  };

  const handleSaveEdit = () => {
    if (editingMessageId && editContent.trim()) {
      const updatedMessage = updateCookbookMessage(editingMessageId, editContent);
      if (updatedMessage) {
        setMessages(messages.map((msg) => (msg.id === editingMessageId ? updatedMessage : msg)));
      }
      setEditingMessageId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleDeleteMessage = (messageId: number) => {
    if (confirm('Are you sure you want to delete this message?')) {
      const success = deleteCookbookMessage(messageId);
      if (success) {
        setMessages(messages.filter((msg) => msg.id !== messageId));
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

  const isOwnMessage = (message: CookbookMessage) => message.userId === currentUser.id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-orange-600" />
            Cookbook Chat
          </h3>
          <span className="text-sm text-gray-500">{messages.length} messages</span>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isOwnMessage(message)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {/* User info */}
                {!isOwnMessage(message) && (
                  <div className="flex items-center mb-1">
                    {message.user?.avatar ? (
                      <img
                        src={message.user.avatar}
                        alt={message.user.firstname}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center mr-2">
                        <span className="text-xs text-orange-700 font-medium">
                          {message.user?.firstname?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-xs font-medium">
                      {message.user?.firstname} {message.user?.lastname}
                    </span>
                  </div>
                )}

                {/* Message content */}
                {editingMessageId === message.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className={`w-full p-2 rounded text-sm ${
                        isOwnMessage(message)
                          ? 'bg-orange-600 text-white placeholder-orange-200'
                          : 'bg-white text-gray-900 placeholder-gray-400'
                      }`}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="text-xs px-2 py-1 bg-white text-orange-600 rounded hover:bg-orange-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-xs px-2 py-1 bg-white/20 text-white rounded hover:bg-white/30"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${isOwnMessage(message) ? 'text-orange-200' : 'text-gray-500'}`}>
                        {formatTime(message.createdAt)}
                      </span>
                      {isOwnMessage(message) && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditMessage(message.id)}
                            className="text-xs px-1 py-0.5 hover:bg-white/20 rounded"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="text-xs px-1 py-0.5 hover:bg-white/20 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
