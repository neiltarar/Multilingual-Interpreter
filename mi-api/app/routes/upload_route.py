from flask import Blueprint, request, jsonify
from utils.audio_utils import process_audio_file, delete_specific_files
from utils.word_splitter import add_newline_every_20_words
from services.openai_service import translation, gpt_helper, image_generation
import speech_recognition as sr

upload_bp = Blueprint('upload_bp', __name__)  # Creating a Blueprint

# Create a recogniser object
speech_recogniser = sr.Recognizer()

@upload_bp.route('/api/prompt-voice', methods=['POST'])
def upload_voice_route():
    if 'recordedSound' in request.files:
        audio_file = request.files['recordedSound']
        selected_language = request.form['selectedLanguage'].lower()
        transcription_model = request.form['selectedTranscriptionSpeed'].lower()
        file_path, error, files_to_delete = process_audio_file(audio_file)
   
        if error:
            delete_specific_files(files_to_delete)
            return jsonify({'error': error})
        try:
            with sr.AudioFile(file_path) as source:
                audio = speech_recogniser.record(source)
                text = speech_recogniser.recognize_whisper(model=transcription_model, language=selected_language, audio_data=audio)
                delete_specific_files(files_to_delete)
                return jsonify({'message':f'{text}'})
              
        except sr.UnknownValueError:
            delete_specific_files(files_to_delete)
            return jsonify({"message":"Couldn't understand your speech"})
        except sr.RequestError as error:
            print(f"Error: {error}")
            delete_specific_files(files_to_delete)
            return jsonify({"message": "Couldn't understand your speech"})
        except Exception as error:
            print(f"Error as exeption: {error}")
            delete_specific_files(files_to_delete)
            return jsonify({"message": "I am sorry I didn't catch what you said\nOzur dilerim ne soyledigini anlayamadim!"})
    else:
        return jsonify({'error': 'No audio file found'})