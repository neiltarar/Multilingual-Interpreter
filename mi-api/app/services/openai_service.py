import os
import openai

openai.api_key = os.getenv("CHAT-GPT_API_KEY") 

def translation(source, target, text):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Translate the following from {source} into {target}: {text}",
        temperature=0.3,
        max_tokens=200,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )
    return response

def gpt_helper(request_text):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"{request_text}",
        temperature=0.3,
        max_tokens=1000,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )
    return response

def image_generation(image_promt_text):
    response = openai.Image.create(
        prompt=f"{image_promt_text}",
        n=1,
        size="256x256"
    )
    image_url = response['data'][0]['url']

    return image_url