from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

API_KEY = 'AIzaSyAb4CKQ23uIo9PH-FwkGmoB3yHoJHaYuOI'  # Ensure this is managed securely in production
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

@app.route('/')
def index():
    return render_template('chatbot.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.json['message']
    if is_dish_related(user_message):
        try:
            response = chat.send_message(user_message)
            bot_response = format_response(response.text)
            return jsonify({'response': bot_response})
        except Exception as e:
            return jsonify({'response': "Sorry, I encountered an error. Please try again."})
    else:
        return jsonify({'response': "I'm here to recommend dishes based on your ingredients. Please ask about dishes!"})

def format_response(text):
    if not text.endswith(('.', '!', '?')):
        text += '.'
    return text.replace('\n', '<br>')

def is_dish_related(message):
    # Very simple keyword check - you might want a more sophisticated NLP approach
    keywords = ['dish', 'recipe', 'cook', 'ingredient', 'cooking', 'eat']
    return any(keyword in message.lower() for keyword in keywords)

if __name__ == '__main__':
    app.run(debug=True)
