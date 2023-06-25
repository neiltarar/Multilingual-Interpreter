from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# import routes
from routes.upload_route import upload_bp

# load env variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# register route
app.register_blueprint(upload_bp)

if __name__ == '__main__':
    app.run(debug=True)
