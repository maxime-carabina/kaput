from flask import Flask, request
from SPARQLWrapper import SPARQLWrapper, JSON
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)
from routes.quiz_routes import quiz_bp
app.register_blueprint(quiz_bp)



@app.route('/')
def home():
    return "Testing Kaput Backend"


@app.route('/submit-answer', methods=['POST'])
def submit_answer():
    # Logic to handle answer submission
    data = request.json
    user_answer = data['answer']
    # Compare with correct answer and respond
    return "Answer received"

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=8080)
