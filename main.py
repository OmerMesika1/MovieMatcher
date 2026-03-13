import os
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json
import requests
from fastapi.staticfiles import StaticFiles

# This file is the backend. It talks to the AI to get movies.
load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This class defines how the user's survey data looks.
class MovieSurvery(BaseModel):
    vibe: str
    focus_level: int
    company: str
    drama_action: int
    comedy_horror: int
    context: str
    

# This part gets the user's answers and asks the AI for 3 movies.
@app.post("/recommend")
async def recommend(movie_survey: MovieSurvery):
    prompt = f"""
    Suggest 3 movies currently available on Netflix for the following person:
    - Their current vibe is: {movie_survey.vibe}
    - Their focus level is {movie_survey.focus_level} out of 10.
    - They are watching with: {movie_survey.company}
    - They want the movie to be set in: {movie_survey.drama_action} drama/action and {movie_survey.comedy_horror} comedy/horror
    - Extra context from the user: {movie_survey.context}
    
    Important instructions:
    1. Only suggest movies that are on Netflix.
    2. Return the answer ONLY as a JSON list of objects.
    3. Each object must have: 'title', 'year', 'description', and 'why_it_fits'.
    4. 'why_it_fits' should be a short sentence explaining why it matches their survey.
    5. Rank it from 1 to 3
    6. if something is empty ignore this term.
    7. Return your answer values in Hebrew. Only the title in English. JSON keys in English.
    8. Prefer popular movies.
    9. Check yourself twice that the movies exists.
    """
    response = client.models.generate_content( model="gemini-2.5-flash",contents=prompt,config=types.GenerateContentConfig(response_mime_type="application/json",))
    cleaned_response = response.text.replace("```json", "").replace("```", "").strip()
    movie_data = json.loads(cleaned_response)
    for movie in movie_data:
        if get_movie_poster(movie["title"]) == False:
            movie["poster"] = "no_available_poster" # Edge case
        else:
            movie["poster"] = get_movie_poster(movie["title"])
    return { "status": "success", "data": movie_data }    


# These routes help show the website pages to the user.
@app.get("/")
def read_root():
    return FileResponse("index.html")

@app.get("/style.css")
def get_style():
    return FileResponse("style.css")

@app.get("/script.js")
def get_script():
    return FileResponse("script.js")

# This small function finds the movie picture from a movie website.
def get_movie_poster(movie_title: str):
    url = f"https://api.themoviedb.org/3/search/movie?api_key={os.getenv('TMDB_API_KEY')}&query={movie_title}"
    response = requests.get(url)
    data = response.json()
    if data["results"]:
        poster_path=data["results"][0]["poster_path"]
        return f"https://image.tmdb.org/t/p/w500{poster_path}"
    else:
        return False

