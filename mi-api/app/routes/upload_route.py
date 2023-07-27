from flask import Blueprint, request, jsonify
from utils.audio_utils import process_audio_file, delete_audio_files
from utils.word_splitter import add_newline_every_20_words
from services.openai_service import translation, gpt_helper
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
        transcription_model = request.form['selectedTranscriptionSpeed'].lower()
        file_path, error = process_audio_file(audio_file)
        print("selected feature: " + selected_feature)
        print(selected_language, selected_language2)
        if error:
            return jsonify({'error': error})
        try:
            with sr.AudioFile(file_path) as source:
                audio = speech_recogniser.record(source)
                text = speech_recogniser.recognize_whisper(model=transcription_model, language=selected_language, audio_data=audio)
                
                if selected_feature == 'transcribe':
                    if(len(text.split()) > 20):
                        new_text = add_newline_every_20_words(text)
                        return jsonify({"message": new_text})
                    print('transcription has been sent')
                    delete_audio_files()
                    return jsonify({"message": text})
                elif selected_feature == 'gpthelper':
                    gpt_answer_object = gpt_helper(text)
                    gpt_answer = gpt_answer_object.choices[0].text.strip() 
                    delete_audio_files()
                    return jsonify({'message':f'GPT: {gpt_answer}'})

                translated_text_object = translation(selected_language, selected_language2, text)
                translated_text = translated_text_object.choices[0].text.strip() 
                if(len(translated_text.split()) > 20):
                    print('translation has been sent')
                    return jsonify({'message':f'Original: {text}\nTranslation: {translated_text}'})
                
                print('translation has been sent')
                delete_audio_files()
                return jsonify({'message':f'Original: {text}\nTranslation: {translated_text}'})
        
        except sr.UnknownValueError:
            delete_audio_files()
            return jsonify({"message":"Couldn't understand your speech"})
        except sr.RequestError as e:
            print(f"Error: {e}")
            delete_audio_files()
            return jsonify({"message": "Couldn't understand your speech"})
        except Exception as e:
            print(f"Error as exeption: {e}")
            delete_audio_files()
            return jsonify({"message": "I am sorry I didn't catch what you said\nOzur dilerim ne soyledigini anlayamadim!"})
    else:
        return jsonify({'error': 'No audio file found'})