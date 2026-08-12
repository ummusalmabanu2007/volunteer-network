from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Volunteer Community Network Backend is Running!"

if __name__ == "__main__":
    app.run(debug=True)