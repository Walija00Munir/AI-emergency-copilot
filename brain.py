import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

# 1. Open the .env file to get your secret API key
load_dotenv()

# 2. Establish the connection to the Google AI
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def get_advice(problem_description):
    """
    Takes the emergency description and returns structured AI guidance.
    """
    try:
        # 3. Send the prompt to the AI with strict JSON config
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"""SYSTEM: You are a Universal Emergency Specialist. 
            Provide immediate, life-saving advice for any crisis.
            
            USER PROBLEM: {problem_description}""",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema={
                    "type": "object",
                    "properties": {
                        "type": {"type": "string", "description": "The category of the emergency"},
                        "severity": {"type": "integer", "description": "Severity level from 1 to 5"},
                        "steps": {"type": "array", "items": {"type": "string"}, "description": "Actionable steps"},
                        "summary": {"type": "string", "description": "A brief overview"}
                    },
                    "required": ["type", "severity", "steps", "summary"]
                }
            )
        )
        
        # Parse the guaranteed JSON response
        return json.loads(response.text)

    except Exception as e:
        # 4. If the internet or API fails, send this backup message
        return {
            "type": "System Error", 
            "severity": 5, 
            "steps": ["Check internet", "Call 911"], 
            "summary": f"AI Offline: {str(e)}"
        }
