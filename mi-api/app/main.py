from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from config import MAX_CONTENT_LENGTH

# load env variables
load_dotenv()

# import routes
from routes.upload_route import upload_bp

app = Flask(__name__)

# Limit the audio file size being sent 
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH 
CORS(app)

# register route
app.register_blueprint(upload_bp)

if __name__ == '__main__':
    app.run()
