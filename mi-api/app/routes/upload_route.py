from flask import Blueprint, request, jsonify
from utils.audio_utils import process_audio_file
from utils.word_splitter import add_newline_every_20_words
from services.openai_service import translation
import speech_recognition as sr

upload_bp = Blueprint('upload_bp', __name__)  # Creating a Blueprint

# Create a recogniser object
speech_recogniser = sr.Recognizer()

@upload_bp.route('/api/upload', methods=['POST'])
def upload_route():
    if 'recordedSound' in request.files:
        audio_file = request.files['recordedSound']
        selected_language = request.form['selectedLanguage'].lower()
        selected_language2 = request.form['selectedLanguage2'].lower()
        selected_feature = request.form['selectedFeature'].lower()
        file_path, error = process_audio_file(audio_file)
        print("selected feature: " + selected_feature)
        if error:
            return jsonify({'error': error})
        try:
            with sr.AudioFile(file_path) as source:
                audio = speech_recogniser.record(source)
                text = speech_recogniser.recognize_whisper(model="base", language=selected_language, audio_data=audio)
                if selected_feature == 'transcribe':
                    if(len(text.split()) > 20):
                        new_text = add_newline_every_20_words(text)
                        return jsonify({"message": new_text})
                    print('transcription has been sent')
                    return jsonify({"message": text})
                
                translated_text_object = translation('English', 'Turkish', text)
                translated_text = translated_text_object.choices[0].text.strip() 
                print('translation has been sent')
                return jsonify({'message':f'Original: {text}\ntranslation: {translated_text}'})
        except sr.UnknownValueError:
            return jsonify({"message":"Couldn't understand your speech"})
        except sr.RequestError as e:
            print(f"Error: {e}")
            return jsonify({'message': 'Audio received and processed successfully'})
        except Exception as e:
            print(f"Error as exeption: {e}")
            return jsonify({"message": "I am sorry I didn't catch what you said\nOzur dilerim ne soyledigini anlayamadim!"})
    else:
        return jsonify({'error': 'No audio file found'})