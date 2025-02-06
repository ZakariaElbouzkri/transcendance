'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocket } from '@/context/WebSocketContext';
import axios from 'axios'; 
import '../../layout.css'
import Api from '@/lib/api';
import { useParams } from "next/navigation";

type Message = {
  id: number;
  user: string;
  content: string;
  timestamp: string;
};

type User = {
  conv_id: number,
  id: number;
  username: string;
  avatar_url: string;
  is_online: string;
  wins: number;
  losses: number;
  rating: number;
};

function printTime(time: string) {
  let str = time.split('T')[1];
  str = str.split(':')[0] + ':' + str.split(':')[1];
  return str;
}

export default function BoxedChatInterface() {
  const { sendMessage, messages: wsMessages } = useWebSocket();
  const [user, setUser] = useState<User>({
    conv_id: 0,
    id: 0,
    username: '',
    avatar_url: '',
    is_online: '',
    wins: 0,
    losses: 0,
    rating: 0,
  });
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true); 
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const numericId = typeof id === "string" ? parseInt(id, 10) : Array.isArray(id) ? parseInt(id[0], 10) : NaN;

  useEffect(() => {
    Api.get('/users/me/', { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      });
  }, []);

  useEffect(() => {
    Api.get('/users/me/connections/', { withCredentials: true })
      .then((response) => {
        const fetchedUsers: User[] = response.data.results
          .filter((userData) => userData.status === "friends")
          .map((userData) => ({
            conv_id: userData.id,
            id: userData.user.id,
            username: userData.user.username,
            avatar_url: userData.user.avatar_url,
            is_online: userData.user.is_online,
            wins: userData.user.wins,
            losses: userData.user.losses,
            rating: userData.user.rating,
          }));
        setUsers(fetchedUsers);
        if (numericId) {
          const selectedUser: User | undefined = fetchedUsers.find((usr) => usr.id === numericId);
          if (selectedUser) {
            setActiveUser(selectedUser);
          }
        }
        // if (fetchedUsers.length > 0) {
        //   setActiveUser(fetchedUsers[0]);
        // }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  useEffect(() => {
    if (wsMessages.length > 0) {
      setMessages((prevMessages) => {
        const lastMessage = wsMessages[wsMessages.length - 1];
        const newMessage = {
          id: `${lastMessage.sender_id}-${lastMessage.timestamp}-${Math.random().toString(36).substr(2, 9)}`,
          user: lastMessage.sender_id,
          content: lastMessage.message,
          timestamp: lastMessage.timestamp,
        };

        const isDuplicate = prevMessages.some(
          (msg) => msg.content === newMessage.content &&
            msg.timestamp === newMessage.timestamp &&
            msg.user === newMessage.user
        );

        return isDuplicate ? prevMessages : [...prevMessages, newMessage];
      });
    }
  }, [wsMessages]);

  const fetchMessages = useCallback(async (page: number) => {
    if (activeUser) {
      try {
        const response = await Api.get(
          `/users/me/connections/${activeUser.conv_id}/messages/`,
          {
            params: { page },
            withCredentials: true,
          }
        );

        const fetchedMessages: Message[] = response.data.results.map((msgData) => ({
          id: msgData.id,
          user: msgData.sender_id,
          content: msgData.content,
          timestamp: msgData.timestamp,
        }));

        setMessages((prevMessages) => {
          const uniqueMessages = [...new Set([...prevMessages, ...fetchedMessages].map((msg) => msg.id))].map((id) => {
            return [...prevMessages, ...fetchedMessages].find((msg) => msg.id === id);
          });
          return uniqueMessages as Message[];
        });
        setHasMore(response.data.next !== null);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  }, [activeUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (activeUser) {
      setMessages([]); 
      fetchMessages(1);
      setPage(1);
    }
  }, [activeUser, fetchMessages]);

  const handleSend = () => {
    if (message.trim() && activeUser) {
      sendMessage(parseInt(activeUser.id), message);
      setMessage('');
    }
  };

  const handleSearchfriends = (target: string) => {
    const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(target.toLowerCase()));
    setUsers(filteredUsers);
  };

  const handleUserClick = (user: User) => {
    setActiveUser(user);
  };

  const handleLoadMore = () => {
    if (hasMore) {
      const nextPage = page + 1;
      fetchMessages(nextPage);
      setPage(nextPage);
    }
  };

  return (
<div className="flex items-center mt-3 justify-center main-content">
  <div className="w-[calc(100%-20px)] h-[calc(100%-20px)] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex">
      <div className=" w-1/3 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <Input
            type="search"
            placeholder="Search"
            className="w-full"
            onChange={(e) => handleSearchfriends(e.target.value)}
            />
        </div>
        <ScrollArea className="h-[calc(92vh-4rem)]">
          {users.map((user, index) => (
            <div
              key={`${user.id}-${index}`}
              className={`flex items-center space-x-4 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${user.id === activeUser?.id ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
              onClick={() => handleUserClick(user)}
              >
              <Avatar>
                <AvatarImage src={user.avatar_url} alt={user.username} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.is_online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={activeUser?.avatar_url} alt={activeUser?.username} />
              <AvatarFallback>{activeUser?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{activeUser?.username}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{activeUser?.is_online ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        </div>
        <ScrollArea className="h-[calc(85vh-4rem)]">
          {hasMore && (
            <div className="flex justify-center p-4">
              <Button variant="ghost" onClick={handleLoadMore}>
                Load More
              </Button>
            </div>
          )}
          {messages.map((msg, i, msgs) => {
            const newDay = i > 0 && msg.timestamp.split('T')[0] > msgs[i - 1].timestamp.split('T')[0];
            return (
              <React.Fragment key={msg.id}>
                {newDay && (
                  <p className="flex-1 text-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                    {msg.timestamp.split('T')[0]}
                  </p>
                )}
                <div
                  key={msg.id}
                  className={`flex ${msg.user == user?.id ? 'justify-end' : 'justify-start'} p-1 m-3 mb-3`}
                  >
                  <div
                    className={`max-w-[50vw] ${
                      msg.user == user?.id
                      ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    } rounded-lg p-4`}
                    >
                    <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{printTime(msg.timestamp)}</p>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </ScrollArea>
        {activeUser&&<div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
              />
            <Button onClick={handleSend}>
              <Send className="h-5 w-5 mr-2" />
              Send
            </Button>
          </div>
        </div>}
      </div>
    </div>
    </div>
  );
}