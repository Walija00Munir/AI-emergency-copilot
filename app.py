from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from brain import get_advice
import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return redirect("/index.html", code=307)

@app.route("/fix", methods=["POST"])
def fix_issue():
    data = request.json
    user_problem = data.get("problem")
    solution = get_advice(user_problem)
    return jsonify(solution)
