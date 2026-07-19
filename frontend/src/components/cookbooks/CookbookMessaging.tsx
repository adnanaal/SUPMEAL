'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Edit2, Trash2, MessageSquare, X } from 'lucide-react';
import { User } from '@/types';
import { messageService, Message } from '@/services/messageService';

interface CookbookMessagingProps {
  cookbookId: number;
  currentUser: User;
  userPermission?: string;
}

export function CookbookMessaging({ cookbookId, currentUser, userPermission }: CookbookMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const canSendMessage = userPermission === 'OWNER' || userPermission === 'EDITOR' || userPermission === 'COMMENTATOR';

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await messageService.getMessagesByCookbook(cookbookId);
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };
    loadMessages();
  }, [cookbookId]);

  const handleAddMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      // Pour l'instant, receiverId est optionnel pour les messages de groupe
      const message = await messageService.createMessage({
        content: newMessage,
        receiverId: currentUser.id, // Utiliser l'utilisateur actuel comme receiver par défaut
        cookbookId
      });
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to add message:', err);
    }
  };

  const handleUpdateMessage = async (messageId: number) => {
    if (!editContent.trim()) return;
    
    try {
      const updated = await messageService.updateMessage(messageId, {
        content: editContent
      });
      setMessages(messages.map(m => m.id === messageId ? updated : m));
      setEditingMessageId(null);
      setEditContent('');
    } catch (err) {
      console.error('Failed to update message:', err);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await messageService.deleteMessage(messageId);
      setMessages(messages.filter(m => m.id !== messageId));
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">{messages.length}</span>
      </div>

      <div className="mb-6">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Add a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            disabled={!canSendMessage}
          />
          <button
            onClick={handleAddMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!canSendMessage}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {message.senderFirstname} {message.senderLastname}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {editingMessageId === message.id ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      <button
                        onClick={() => handleUpdateMessage(message.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingMessageId(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-900">{message.content}</p>
                  )}
                </div>
                {message.senderId === currentUser.id && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingMessageId(message.id);
                        setEditContent(message.content);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
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
