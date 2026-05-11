from flask import Flask, request, jsonify
from flask_cors import CORS
from brain import get_advice  # Import the function we just made

# Serve static files from the "public" folder
app = Flask(__name__, static_folder='public', static_url_path='')
CORS(app)  # This allows a website to talk to this server

@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/fix", methods=["POST"])
def fix_issue():
    # Receive the problem from the user
    data = request.json
    user_problem = data.get("problem")

    # Send it to the brain and get the answer
    solution = get_advice(user_problem)

    # Send the answer back to the user
    return jsonify(solution)


if __name__ == "__main__":
    print("🚀 Server is live at [http://127.0.0.1:5000](http://127.0.0.1:5000)")
    app.run(debug=False)
