from pydub import AudioSegment
from werkzeug.utils import secure_filename
from config import ALLOWED_EXTENSIONS
from io import BytesIO
import uuid
import speech_recognition as sr

speech_recogniser = sr.Recognizer()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_audio_in_memory(audio_data):
    audio = AudioSegment.from_file(BytesIO(audio_data))
    audio = audio.set_frame_rate(16000)  # Set frame rate suitable for speech recognition

    buffer = BytesIO()
    audio.export(buffer, format="wav")

    return buffer.getvalue()

def process_audio_file(audio_file):
    # Some validation
    if audio_file.filename == '':
        return None, 'No selected file', []
    if not audio_file or not allowed_file(audio_file.filename):
        return None, 'File type not allowed', []

    audio_data = audio_file.read()
    converted_audio_data = convert_audio_in_memory(audio_data)
    
    return converted_audio_data, None, []
