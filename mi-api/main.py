from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/upload', methods=['POST'])
def upload():
    if 'recordedSound' in request.files:
        audio_file = request.files['recordedSound']
        # Save or process the audio file as needed
        # For example, you can save it to disk using audio_file.save(filename)
        return jsonify({'message': 'Audio received and processed successfully'})
    else:
        return jsonify({'error': 'No audio file found'})

if __name__ == '__main__':
    app.run()
