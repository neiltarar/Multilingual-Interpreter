from flask import Blueprint, request, jsonify
from utils.audio_utils import process_audio_file
import speech_recognition as sr

upload_bp = Blueprint('upload_bp', __name__)  # Creating a Blueprint

# Create a recogniser object
speech_recogniser = sr.Recognizer()

@upload_bp.route('/api/upload', methods=['POST'])
def upload_route():
    if 'recordedSound' in request.files:
        audio_file = request.files['recordedSound']
        file_path, error = process_audio_file(audio_file)
        if error:
            return jsonify({'error': error})
        try:
            with sr.AudioFile(file_path) as source:
                audio = speech_recogniser.record(source)
                text = speech_recogniser.recognize_whisper(model="tiny", language="turkish", audio_data=audio)
                return jsonify({'message':text})
        except sr.UnknownValueError:
            return jsonify({"message":"Couldn't understand your speech"})
        except sr.RequestError as e:
            print(f"Error: {e}")
            return jsonify({'message': 'Audio received and processed successfully'})
        except Exception as e:
            print(f"Error as exeption: {e}")
            return jsonify({"message": "Internal Server Error, check server logs"})
    else:
        return jsonify({'error': 'No audio file found'})
