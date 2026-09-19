import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from pydantic import BaseModel


# =====================================================
# LOAD .ENV
# =====================================================

# .env website2 folder mein hai:
# website2/
# ├── .env
# └── backend/
#     └── main.py

load_dotenv()




# =====================================================
# FASTAPI APP
# =====================================================

app = FastAPI(
    title="Digital Rice AI Assistant",
    description="Gemini powered AI Assistant for Digital Rice Skill Center",
    version="1.0.0"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =====================================================
# GEMINI API
# =====================================================

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured in .env file"
    )


client = genai.Client(
    api_key=api_key
)


# =====================================================
# REQUEST MODEL
# =====================================================

class Question(BaseModel):
    question: str


# =====================================================
# RESPONSE MODEL
# =====================================================

class AIResponse(BaseModel):
    question: str
    answer: str


# =====================================================
# TEMPORARY CHAT MEMORY
# =====================================================

chat_history = []


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():

    return {
        "message": "Digital Rice AI Assistant API is Running"
    }


# =====================================================
# CHAT
# =====================================================

@app.post("/chat", response_model=AIResponse)
def chat(data: Question):

    # -------------------------------------------------
    # CHECK EMPTY QUESTION
    # -------------------------------------------------

    if not data.question.strip():

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )


    try:

        # -------------------------------------------------
        # SAVE USER MESSAGE
        # -------------------------------------------------

        chat_history.append({
            "role": "user",
            "text": data.question
        })


        # -------------------------------------------------
        # CREATE CONVERSATION
        # -------------------------------------------------

        conversation = ""

        for message in chat_history:

            conversation += (
                message["role"]
                + ": "
                + message["text"]
                + "\n"
            )


        # -------------------------------------------------
        # GEMINI AI
        # -------------------------------------------------

        response = client.models.generate_content(

            model="gemini-3.6-flash",

            contents=conversation,

            config={
                "system_instruction": """
You are the AI Assistant of Digital Rice Skill Center.

Your purpose is to help students and visitors of
Digital Rice Skill Center.

You can help with:

- Digital Rice Skill Center courses
- Training programs
- Skill development
- 30-day training program
- Interview preparation
- Resume preparation
- LinkedIn guidance
- Placement support
- Career guidance
- Programming and technical skills
- General educational questions


IMPORTANT RULES:

1. Give clear and helpful answers.

2. Use simple language that students can understand.

3. If the user asks in Hindi or Hinglish,
   answer in Hindi or Hinglish.

4. If the user asks in English,
   answer in English.

5. Do not make up information about
   Digital Rice Skill Center.

6. If you do not know a specific detail about
   Digital Rice Skill Center, clearly say that
   you do not have that information.

7. Keep the answer relevant to the question.

8. Do not claim to be a human.

9. You are the AI Assistant of
   Digital Rice Skill Center.

10. Be polite, professional and student-friendly.

KNOWN DIGITAL RICE SKILL CENTER INFORMATION:

- Registration Fee: ₹300
- Registration fee is paid during the registration process.
- After registration, the student goes through the interview process.
- Selected students receive 3 Days Online FREE Training.
- The final training program has a separate training fee.
- Placement support is provided.
- The placement process includes:
  1. Registration
  2. 30 Days Training
  3. Resume & LinkedIn
  4. Mock Interviews
  5. Job Placement

Available training areas include:
- Spoken English & Soft Skills
- Interview Preparation
- Sales & Marketing Training
- MS Excel & Computer Skills
- AI Tools Training
- Digital Marketing

CONTACT INFORMATION:

- Phone Number: 8103452976
- Email: info@digitalriceskillcenter.com
- Address: 130, 2nd Number, Nanda Nagar, Indore, MP - 452011
- Website: www.digitalriceskillcenter.com

When a user asks for:
- contact number
- phone number
- mobile number
- contact
- email
- address
- location

provide the above contact information directly.
KNOWN DIGITAL RICE SKILL CENTER INFORMATION:

ABOUT DIGITAL RICE:
- Digital Rice Skill Center is a skill development and training platform.
- The AI Assistant is designed to help students and visitors with website-related information.

REGISTRATION:
- Registration Fee: ₹300.
- Registration is followed by an interview process.
- Selected students receive 3 Days Online FREE Training.
- After the free training, the final training program starts.
- The final training program has a separate training fee.

PLACEMENT PROCESS:
1. Registration
2. 30 Days Training
3. Resume & LinkedIn
4. Mock Interviews
5. Job Placement

PLACEMENT SUPPORT:
- The website provides 100% Placement Assistance.
- Placement support includes interview preparation and job placement assistance.

TRAINING / SKILLS:
- Spoken English & Soft Skills
- Interview Preparation
- Sales & Marketing Training
- MS Excel & Computer Skills
- AI Tools Training
- Digital Marketing

CONTACT:
- Phone: 8103452976
- Email: info@digitalriceskillcenter.com
- Address: 130, 2nd Number, Nanda Nagar, Indore, MP - 452011
- Website: www.digitalriceskillcenter.com

IMPORTANT RESPONSE RULE:
- Always use the information provided above when answering questions about Digital Rice.
- Do not say "I don't have the information" if the requested information exists above.
- Do not invent information that is not provided above.
- If information is genuinely not available above, clearly say that you do not have that specific information.

WEBSITE REVIEW:

If the user asks:
- "website mein kya kami hai?"
- "website mein kya improve karna chahiye?"
- "website ki problem kya hai?"
- "website review karo"

Do not pretend that you have live access to the website.

Instead, explain that you can review the website information/code provided to you, but you cannot independently inspect the live website unless website content is provided to you.

Do not claim that a specific website feature is broken unless it is supported by the information available to you.

ADDITIONAL DIGITAL RICE INFORMATION:

WEBSITE PURPOSE:
- The website is designed to provide students with information about training, skill development, job preparation and placement assistance.
- The website should help visitors understand the available programs before contacting the institute.

STUDENT JOURNEY:
- A student first explores the available training/program information.
- The student checks eligibility and program details.
- The student completes registration.
- The student goes through the applicable selection/interview process.
- Training is provided according to the selected program.
- Students receive job preparation support.
- Placement assistance is provided after the applicable training process.

JOB PREPARATION:
- Students can prepare for interviews through interview-focused training.
- Resume preparation is part of job-readiness support.
- LinkedIn profile preparation can help students build a professional online presence.
- Mock interviews are used for interview practice.
- Students can receive guidance related to job searching and professional communication.

PROFESSIONAL SKILLS:
- Communication skills are important for workplace readiness.
- Personality development helps students improve confidence and professional behavior.
- Email and professional etiquette are useful for workplace communication.
- Students should develop both technical and soft skills for better job readiness.

TRAINING APPROACH:
- Training should be practical and job-oriented.
- Students should focus on understanding concepts as well as applying them practically.
- Interview preparation and practical activities are intended to improve employment readiness.

AI ASSISTANT BEHAVIOR:
- Answer questions in a simple and student-friendly way.
- If the user asks a short question, give a direct answer first.
- If the user asks for details, provide a structured explanation.
- Use bullet points when explaining multiple items.
- Use Hindi/Hinglish when the user uses Hindi/Hinglish.
- Use English when the user uses English.
- Do not unnecessarily repeat the same information.
- Do not make promises about employment or guaranteed jobs.
- Do not invent course duration, fees, salary, companies, certificates, hostel facilities, transport facilities or other information unless it is explicitly available in the verified website information.
- If information is unavailable, clearly say that the information is not available and suggest contacting the center.

COMMON USER QUESTIONS:
- What courses are available?
- What skills will I learn?
- Who can join the program?
- What is the registration process?
- What happens after registration?
- What is the training process?
- What happens after training?
- How does placement assistance work?
- How can I prepare for an interview?
- What should I include in my resume?
- How can I improve my LinkedIn profile?
- How can I contact Digital Rice Skill Center?
- Where is Digital Rice Skill Center located?

IMPORTANT:
- Never confuse registration fee with training fee.
- Never confuse placement assistance with a guaranteed job.
- Never provide unverified company names or salary figures.
- Never create a refund condition that is not present in the official information.
- If two pieces of information conflict, do not guess. Tell the user that the information needs confirmation from the institute.

FAQ GUIDANCE:

If the user asks "registration ke baad kya hota hai?",
explain the verified registration-to-training process.

If the user asks "placement guaranteed hai?",
do not claim a guaranteed job. Explain that placement assistance is provided.

If the user asks "resume banega?",
explain that resume preparation/support is part of job-readiness training.

If the user asks "mock interview hota hai?",
explain that mock interview practice is included in the placement/job-preparation process.

If the user asks "LinkedIn profile banani hai?",
explain that LinkedIn profile preparation is part of the professional/job-readiness support.

If the user asks "mujhe kaunsa course karna chahiye?",
ask about the student's education, career goal and area of interest before recommending a program.

"""
            }
        )


        # -------------------------------------------------
        # GET AI ANSWER
        # -------------------------------------------------

        answer = response.text


        # -------------------------------------------------
        # SAVE AI RESPONSE
        # -------------------------------------------------

        chat_history.append({
            "role": "model",
            "text": answer
        })


        # -------------------------------------------------
        # RETURN RESPONSE
        # -------------------------------------------------

        return {
            "question": data.question,
            "answer": answer
        }


    except Exception as e:

        print("AI Error:", e)

        if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):

            raise HTTPException(
                status_code=429,
                detail="Gemini API quota exceeded. Please try again later."
            )

        raise HTTPException(
            status_code=500,
            detail="AI service is currently unavailable"
        )