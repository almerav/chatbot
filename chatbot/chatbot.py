import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

# Initialize Flask app
app = Flask(__name__)

# Configure Generative AI
API_KEY = 'AIzaSyAb4CKQ23uIo9PH-FwkGmoB3yHoJHaYuOI'
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

@app.route('/')
def index():
    return render_template('chatbot.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.json['message']
    show_buttons = False
    try:
        response = chat.send_message(user_message)
        bot_response = format_response(response.text)
        recipe_name = extract_recipe_name(bot_response)
        if recipe_name == "Unknown Recipe":
            bot_response_with_name = bot_response
        else:
            # Ensure the recipe name is only included once
            if f"**{recipe_name}**" not in bot_response:
                bot_response_with_name = f"**Recipe Name:** {recipe_name}\n\n" + bot_response
            else:
                bot_response_with_name = bot_response.replace(f"**{recipe_name}**", f"**Recipe Name:** {recipe_name}")
        show_buttons = True  # Show buttons after recommending a recipe
        return jsonify({'response': bot_response_with_name, 'show_buttons': show_buttons, 'recipe_name': recipe_name})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'response': "Sorry, I encountered an error. Please try again.", 'show_buttons': False})

def format_response(text):
    if not text.endswith(('.', '!', '?')):
        text += '.'
    return text.replace('\n', '<br>')

def extract_recipe_name(text):
    # Extract the recipe name from the response text
    # Example: "**Recipe Name**"
    try:
        start = text.index('**') + 2
        end = text.index('**', start)
        return text[start:end].strip()
    except ValueError:
        return "Unknown Recipe"

if __name__ == '__main__':
    app.run(debug=True)