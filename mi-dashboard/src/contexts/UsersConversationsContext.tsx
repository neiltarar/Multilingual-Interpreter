import { createContext, useContext, useState, useRef } from "react";
import axios, { AxiosResponse } from "axios";

interface Conversation {
  topic: string;
  conversation_id: number;
}
interface UsersConversationsContextType {}

const UsersConversationsContext = createContext<
  UsersConversationsContextType | undefined
>(undefined);

export const useUsersConversations = () => {
  return useContext(UsersConversationsContext);
};

export const UsersConversationsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [usersConversations, setUsersConversations] = useState<Conversation[]>(
    [],
  );

  const handleNewConversation = async (topic: string) => {
    try {
      const response = await axios.post(
        `/conversations/new`,
        { topic },
        { withCredentials: true },
      );
      if (response.status === 200) {
        setUsersConversations((prev) => [...prev, response.data.conversation]);
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
        setUsersConversations((prev) =>
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
        setUsersConversations((prev) =>
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
    <UsersConversationsContext.Provider
      value={{
        usersConversations,
        handleNewConversation,
        handleDeleteConversation,
        handleRenameConversation,
      }}
    >
      {children}
    </UsersConversationsContext.Provider>
  );
};
