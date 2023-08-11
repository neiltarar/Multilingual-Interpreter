from flask import Blueprint, request, jsonify
from utils.audio_utils import process_audio_file, delete_specific_files
from utils.word_splitter import add_newline_every_20_words
from services.openai_service import translation, gpt_helper, image_generation
import speech_recognition as sr

upload_bp = Blueprint('upload_bp', __name__)  # Creating a Blueprint

# Create a recogniser object
speech_recogniser = sr.Recognizer()

@upload_bp.route('/api/upload', methods=['POST'])
def upload_voice_route():
    if 'recordedSound' in request.files:
        audio_file = request.files['recordedSound']
        selected_language = request.form['selectedLanguage'].lower()
        selected_language2 = request.form['selectedLanguage2'].lower()
        selected_feature = request.form['selectedFeature'].lower()
        transcription_model = request.form['selectedTranscriptionSpeed'].lower()
        file_path, error, files_to_delete = process_audio_file(audio_file)
        print("selected feature: " + selected_feature)
        print(selected_language, selected_language2)
        if error:
            delete_specific_files(files_to_delete)
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
                    delete_specific_files(files_to_delete)
                    return jsonify({"message": text})
                elif selected_feature == 'gpthelper':
                    gpt_answer_object = gpt_helper(text)
                    gpt_answer = gpt_answer_object.choices[0].text.strip() 
                    delete_specific_files(files_to_delete)
                    return jsonify({'message':f'GPT:\n{gpt_answer}'})
                elif selected_feature == 'imagegenerator':
                    gpt_image_url = image_generation(text)
                    delete_specific_files(files_to_delete)
                    return jsonify({'message': gpt_image_url})
                elif selected_feature == 'translate':
                    translated_text_object = translation(selected_language, selected_language2, text)
                    translated_text = translated_text_object.choices[0].text.strip() 
                    if(len(translated_text.split()) > 20):
                        print('translation has been sent')
                        return jsonify({'message':f'{translated_text}'})
                
                    print('translation has been sent')
                    delete_specific_files(files_to_delete)
                    return jsonify({'message':f'{translated_text}'})
                else:
                    return jsonify({"message":"Couldn't understand what you asked for"})
        
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
    
@upload_bp.route('/api/prompt', methods=['POST'])
def upload_text_prompt_route():
        selected_language = request.form['selectedLanguage'].lower()
        selected_language2 = request.form['selectedLanguage2'].lower()
        selected_feature = request.form['selectedFeature'].lower()
        text = request.form['promptInput']

        print("selected feature: " + selected_feature)
        print(selected_language, selected_language2)

        try:
            if selected_feature == 'transcribe':
                if(len(text.split()) > 20):
                    new_text = add_newline_every_20_words(text)
                    return jsonify({"message": new_text})
                print('transcription has been sent')
                return jsonify({"message": text})
            elif selected_feature == 'gpthelper':
                gpt_answer_object = gpt_helper(text)
                gpt_answer = gpt_answer_object.choices[0].text.strip() 
                return jsonify({'message':f'GPT:\n{gpt_answer}'})
            elif selected_feature == 'imagegenerator':
                gpt_image_url = image_generation(text)
                return jsonify({'message': gpt_image_url})
            elif selected_feature == 'translate':
                translated_text_object = translation(selected_language, selected_language2, text)
                translated_text = translated_text_object.choices[0].text.strip() 
                if(len(translated_text.split()) > 20):
                    print('translation has been sent')
                    return jsonify({'message':f'{translated_text}'})
            
                print('translation has been sent')
                return jsonify({'message':f'{translated_text}'})
            else:
                return jsonify({"message":"Couldn't understand what you asked for"})
        except sr.UnknownValueError:
            return jsonify({"message":"Couldn't understand your speech"})
        except sr.RequestError as error:
            print(f"Error: {error}")
            return jsonify({"message": "Couldn't understand your speech"})
        except Exception as error:
            print(f"Error as exeption: {error}")
            return jsonify({"message": "I am sorry I didn't catch what you said\nOzur dilerim ne soyledigini anlayamadim!"})
 