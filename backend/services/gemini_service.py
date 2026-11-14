import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def analyze_resume(resume_text):

    prompt = f"""
    Analyze this resume.

    Return:
    1. Resume score out of 100
    2. Top skills
    3. Strengths
    4. Missing skills
    5. Suggestions

    Resume:
    {resume_text}
    """

    response = model.generate_content(prompt)

    return response.text