# Movie Matcher 🍿

Hello! This is a simple and fun web app to help you find a movie to watch on Netflix. You answer some questions, and the AI tells you which movie is best for you.

## Live Demo 🚀
You can try the app right now here: [Movie Matcher Live](https://moviematcher-d9et.onrender.com/)

## How it works?
1. **The Survey**: You choose your mood, who you are with, and what you like.
2. **The AI**: We send your answers to **Google Gemini AI**.
3. **The Results**: You get 3 movie titles, posters, and a short explanation of why it fits you.

## Features
- **Smart AI**: Uses Gemini 2.5 Flash to understand your vibe.
- **Cool Design**: Dark theme with fun animations and a popcorn mouse cursor!
- **Hebrew Support**: The front part of the website is in Hebrew.
- **Movie Posters**: We find the real movie pictures using the TMDB website.

## How to use it?

### 1. Requirements
You need Python and some libraries. To install them, run:
```bash
pip install -r requirements.txt
```

### 2. API Keys
You need two keys to make it work. Put them in a file named `.env`:
- `GOOGLE_API_KEY`: Get this from Google AI Studio.
- `TMDB_API_KEY`: Get this from The Movie Database (TMDB).

### 3. Run the App
Start the server with this command:
```bash
python -m uvicorn main:app --reload
```
Then, open your browser and go to: `http://localhost:8000`

## Tech Stuff
- **Frontend**: HTML, CSS, JavaScript.
- **Backend**: Python with FastAPI.
- **AI**: Google GenAI (Gemini).
- **Posters**: TMDB API.
