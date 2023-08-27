interface Message {
  role: string;
  content: string;
}

export const transformHistoryForGPT = (
  history: any[],
  promptText: string,
): Message[] => {
  // Start with the fixed 'system' message
  const transformedHistory: Message[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant, who is polite and asks for further information when needed to help better.",
    },
  ];

  // Add each message from the history to the transformed history
  history.forEach((message) => {
    transformedHistory.push({
      role: message.role,
      content: message.content,
    });
  });

  transformedHistory.push({ role: "user", content: promptText });
  return transformedHistory;
};
