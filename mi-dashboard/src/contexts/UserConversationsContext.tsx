import { createContext, useContext, useState } from "react";
import { AxiosResponse } from "axios";
import axios from "axios";

interface Conversation {
  topic: string;
  conversation_id: number;
}

interface ConversationMessage {
  content: string;
  conversation_id: number;
  created_at: string;
  id: number;
  role: string;
}

interface UserConversationsContextType {
  conversationId: number | null;
  userConversations: Conversation[];
  conversationMessages: any[];
  handleGetAllConversationMessages: (
    conversationId: number,
  ) => Promise<AxiosResponse<any> | null>;
  handleNewConversation: (topic: string) => Promise<AxiosResponse<any> | null>;
  handleDeleteConversation: (
    conversation_id: number,
  ) => Promise<AxiosResponse<any> | null>;
  handleRenameConversation: (
    conversation_id: number,
    topic: string,
  ) => Promise<AxiosResponse<any> | null>;
}

const UserConversationsContext = createContext<
  UserConversationsContextType | undefined
>(undefined);

export const useUserConversations = () => {
  return useContext(UserConversationsContext);
};

export const UserConversationsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userConversations, setUserConversations] = useState<Conversation[]>(
    [],
  );
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const handleGetAllConversationMessages = async (conversationId: number) => {
    try {
      console.log("hit it", conversationId);
      const response = await axios.get(`/api/conversations/${conversationId}`, {
        withCredentials: true,
      });
      const conversationMessages = response.data.conversationMessages;
      console.log("response", response.data);
      if (response.status === 200) {
        setConversationId(conversationId);
        setConversationMessages((prev) => [...conversationMessages]);
      }
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleNewConversation = async (topic: string) => {
    try {
      const response = await axios.post(
        `/conversations/new`,
        { topic },
        { withCredentials: true },
      );
      if (response.status === 200) {
        setUserConversations((prev) => [...prev, response.data.conversation]);
      }
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleDeleteConversation = async (conversation_id: number) => {
    try {
      const response = await axios.delete(`/conversations/${conversation_id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserConversations((prev) =>
          prev.filter(
            (conversation) => conversation.conversation_id !== conversation_id,
          ),
        );
      }
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleRenameConversation = async (
    conversation_id: number,
    topic: string,
  ) => {
    try {
      const response = await axios.put(
        `/conversations/${conversation_id}`,
        { topic },
        { withCredentials: true },
      );
      if (response.status === 200) {
        setUserConversations((prev) =>
          prev.map((conversation) =>
            conversation.conversation_id === conversation_id
              ? { ...conversation, topic }
              : conversation,
          ),
        );
      }
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return (
    <UserConversationsContext.Provider
      value={{
        userConversations,
        conversationMessages,
        conversationId,
        handleGetAllConversationMessages,
        handleNewConversation,
        handleDeleteConversation,
        handleRenameConversation,
      }}
    >
      {children}
    </UserConversationsContext.Provider>
  );
};
