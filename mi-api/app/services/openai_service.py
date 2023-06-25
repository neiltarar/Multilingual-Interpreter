import os
import openai

openai.api_key = os.getenv("CHAT-GPT_API_KEY") 

def translation(source, target, text):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Translate the following from {source} into {target}: {text}",
        temperature=0.3,
        max_tokens=100,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )
    return response