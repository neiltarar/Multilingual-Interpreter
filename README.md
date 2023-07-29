# 🌍 Speak2GPT

Multilingual Assistant is a web application that enables users to interact with a chatbot powered by OpenAI's ChatGPT. Users can enter text or use their microphone to communicate in various languages. The chatbot can translate the entered text into the desired language, providing a seamless multilingual conversational experience. 💬

## 🎥 Demo Video

Check out the demo video [here]("https://neil-tarar.com/videos/Speak2GPT_demo.mp4")

## 🔧 Technologies Used

- 📚 React
- 🌐 TypeScript
- 🐍 Flask
- 🧠 OpenAI GPT-3.5

## ⭐ Features

- 🎙️ **Transcription**: Convert spoken language into written text. Perfect for transcribing interviews or lectures.
- 🔄 **Translation**: Seamlessly translate text between English, Turkish, Spanish and French.
- 🤖 **GPT Helper**: Have a chat with OpenAI's powerful GPT-3.5 model. Ask questions, get answers, or just chat.
- 🖼️ **Image Generator**: Provide a description and let the model generate a relevant image. Ideal for when you need a quick visual.

## 🚀 Getting Started

Follow these steps to set up the project:

### Prerequisites

- Node.js (v14 or later)
- Python (v3.6 or later)
- ffmpeg version 4.4.2 (For audio conversion)

### Installation

1. Clone this repository:

```bash
   git clone https://github.com/your-username/Speak2GPT.git
```

2. Navigate to the mi-api directory, create a virtual environment, activate it, and install the dependencies:

```bash
cd mi-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

```

3. Start the Flask server:

```bash
cd app
python main.py
```

4. Open a new terminal window, navigate to the mi-auth directory and install the dependencies:

```bash
cd ../mi-auth
npm i

```

5. Do the same for the mi-dashboard directory:

```bash
cd ../mi-dashboard
npm i
```

After completing these steps, you should have the Multilingual Assistant up and running! 🎉
