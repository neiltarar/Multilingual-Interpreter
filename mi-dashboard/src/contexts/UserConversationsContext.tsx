import {createContext, useContext, useState, useRef} from "react";
import axios from "axios";

interface Conversation {
    topic: string;
    conversation_id: number;
}

interface UserConversationsContextType {
}

const UserConversationsContext = createContext<
    UserConversationsContextType | undefined
>(undefined);

export const useUserConversations = () => {
    return useContext(UserConversationsContext);
};

export const UserConversationsProvider: React.FC<{
    children: React.ReactNode;
}> = ({children}) => {
    const [userConversations, setUserConversations] = useState<Conversation[]>(
        [],
    );

    const handleGetAllConversations = async (conversationId: number) => {
        try {
            console.log("hit it");
            const response = await axios.get(`/api/conversations`, {
                withCredentials: true,
            });
            console.log("response", response);
            if (response.status === 200) {
                setUserConversations(response.data.conversations);
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
                {topic},
                {withCredentials: true},
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
                {topic},
                {withCredentials: true},
            );
            if (response.status === 200) {
                setUserConversations((prev) =>
                    prev.map((conversation) =>
                        conversation.conversation_id === conversation_id
                            ? {...conversation, topic}
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
                userConversations: userConversations,
                handleGetAllConversations,
                handleNewConversation,
                handleDeleteConversation,
                handleRenameConversation,
            }}
        >
            {children}
        </UserConversationsContext.Provider>
    );
};
