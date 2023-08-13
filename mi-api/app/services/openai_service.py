import os
import openai

openai.api_key = os.getenv("CHAT-GPT_API_KEY") 

# To see all the available models comment in the lines below:
# models = openai.Model.list()
# print("Models: ", models)

def translation(source, target, text):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful multilingual translator. You always try to translate from source to target languages by trying to stay true to the meaning, culture and its context."},
            {"role": "user", "content": f"Translate the following from source:{source} into target:{target}: '{text}'"}
        ],
        temperature=0.3,
        max_tokens=2000,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )
    return response

def gpt_helper(request_text):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant, who is polite and asks for further information when needed to help better."},
            {"role": "user", "content": f"{request_text}"}
        ],
        temperature=0.3,
        max_tokens=2000,
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