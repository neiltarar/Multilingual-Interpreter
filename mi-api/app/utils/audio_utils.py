from pydub import AudioSegment
from werkzeug.utils import secure_filename
from config import ALLOWED_EXTENSIONS
import speech_recognition as sr
import os

speech_recogniser = sr.Recognizer()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_audio(input_file):
    # Load and modify the audio
    audio = AudioSegment.from_file(input_file)
    audio = audio.set_frame_rate(16000)  # Set frame rate suitable for speech recognition

    # Export audio to a new WAV file
    converted_file_path = "converted_audio.wav"
    audio.export(converted_file_path, format="wav")

    # Read the audio data from the new file as bytes and return
    with open(converted_file_path, 'rb') as f:
        audio_data = f.read()

    # Optionally, delete the converted file after we're done with it
    os.remove(converted_file_path)

    return audio_data

def process_audio_file(audio_file):
    # Some validation
    if audio_file.filename == '':
        return None, 'No selected file'
    if not audio_file or not allowed_file(audio_file.filename):
        return None, 'File type not allowed'

    filename = secure_filename(audio_file.filename)
    file_path = os.path.join('uploads', filename)
    audio_file.save(file_path)

    # Convert the uploaded audio file to a file-like object
    audio_data = convert_audio(file_path)

    # Save the converted audio data to a file
    converted_file_path = os.path.join('uploads', 'converted_' + filename)
    with open(converted_file_path, 'wb') as f:
        f.write(audio_data)

    return converted_file_path, None
