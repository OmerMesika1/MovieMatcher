// This code chooses a random background and sets up the app.
const randomGifNumber = Math.floor(Math.random() * 3) + 1;
document.documentElement.style.setProperty('--bg-gif-url', `url('./static/bg_gif_${randomGifNumber}.gif')`);

let user_answers = {
    "vibe": "any",
    "focus_level": 5,
    "company": "any",
    "drama_action": 0,
    "comedy_horror": 0,
    "context": ""
}
function hide_section(section) {
    section.classList.add("hidden")
}
function show_section(section) {
    section.classList.remove("hidden")
}
function movingFoward(current_section, next_section) {
    hide_section(current_section)
    show_section(next_section)
}

// We save the user choices into our answer list here.
function saveResults(number, answer1, answer2 = null) {
    const numbers_to_answers = {
        1: "vibe",
        2: "focus_level",
        3: "company",
        4: "drama_action",
        5: "context"
    }
    if (answer1 === null || answer1 === "") {
        user_answers[numbers_to_answers[number]] = "any"
    } else {
        user_answers[numbers_to_answers[number]] = answer1
    }
    if (answer2 != null) {
        user_answers["comedy_horror"] = answer2
    }
}

// This function puts the movie details on the page for the user to see.
function processResults(data) {
    const movie1 = document.getElementById("movie1")
    const movie2 = document.getElementById("movie2")
    const movie3 = document.getElementById("movie3")
    if (data[0].poster != "no_available_poster") {
        movie1.querySelector("#movie1_poster").src = data[0].poster
    } else {
        movie1.querySelector("#movie1_poster").src = "./static/no_available_poster.png"
    }
    if (data[1].poster != "no_available_poster") {
        movie2.querySelector("#movie2_poster").src = data[1].poster
    } else {
        movie2.querySelector("#movie2_poster").src = "./static/no_available_poster.png"
    }
    if (data[2].poster != "no_available_poster") {
        movie3.querySelector("#movie3_poster").src = data[2].poster
    } else {
        movie3.querySelector("#movie3_poster").src = "./static/no_available_poster.png"
    }
    movie1.querySelector(".movie_title").innerHTML = "<strong>כותרת: </strong> " + data[0].title
    movie1.querySelector(".movie_description").innerHTML = "<strong>תקציר: </strong> " + data[0].description
    movie1.querySelector(".movie_why_it_fits").innerHTML = "<strong>למה זה מתאים: </strong> " + data[0].why_it_fits
    movie2.querySelector(".movie_title").innerHTML = "<strong>כותרת: </strong> " + data[1].title
    movie2.querySelector(".movie_description").innerHTML = "<strong>תקציר: </strong> " + data[1].description
    movie2.querySelector(".movie_why_it_fits").innerHTML = "<strong>למה זה מתאים: </strong> " + data[1].why_it_fits
    movie3.querySelector(".movie_title").innerHTML = "<strong>כותרת: </strong> " + data[2].title
    movie3.querySelector(".movie_description").innerHTML = "<strong>תקציר: </strong> " + data[2].description
    movie3.querySelector(".movie_why_it_fits").innerHTML = "<strong>למה זה מתאים: </strong> " + data[2].why_it_fits
}
function failedToProcess() {
    movingFoward(loading, error)
}
//sections
const landingPage = document.getElementById("landingPage")
const results = document.getElementById("results")
const loading = document.getElementById("loading")
const error = document.getElementById("error")
//questions
const q1 = document.getElementById("q1")
const q2 = document.getElementById("q2")
const q3 = document.getElementById("q3")
const q4 = document.getElementById("q4")
const q5 = document.getElementById("q5")
//buttons
const move_to_questions = document.getElementById("move_to_questions")
const move_to_q2 = document.getElementById("move_to_q2")
const move_to_q3 = document.getElementById("move_to_q3")
const move_to_q4 = document.getElementById("move_to_q4")
const move_to_q5 = document.getElementById("move_to_q5")
const move_to_results = document.getElementById("move_to_results")
const retry_button = document.querySelector("#retry_button")
//listeners
let value //answered value | changing..
move_to_questions.addEventListener("click", () => {
    movingFoward(landingPage, q1)
})
move_to_q2.addEventListener("click", () => {
    movingFoward(q1, q2)
    value = document.querySelector('input[name="vibe"]:checked')
    console.log("vibe is: " + value.value)
    saveResults(1, value ? value.value : null)

})
move_to_q3.addEventListener("click", () => {
    movingFoward(q2, q3)
    value = parseInt(document.getElementById("focus_level").value)
    saveResults(2, value)
})
move_to_q4.addEventListener("click", () => {
    movingFoward(q3, q4)
    value = document.querySelector('input[name="company"]:checked')
    saveResults(3, value ? value.value : null)
})
move_to_q5.addEventListener("click", () => {
    movingFoward(q4, q5)
    value1 = parseInt(document.getElementById("genre_axis_1").value)
    value2 = parseInt(document.getElementById("genre_axis_2").value)
    saveResults(4, value1, value2)
})
move_to_results.addEventListener("click", () => {
    movingFoward(q5, loading) // Move to loading screen first
    value = document.getElementById("context").value
    saveResults(5, value)
    console.log(user_answers)
    //send it
    getMovies()
})
function getMovies() {
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
        ? "http://localhost:8000"
        : "";

    fetch(`${API_BASE_URL}/recommend`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user_answers),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Success:", data);
            processResults(data.data)
            movingFoward(loading, results) // Show results when done
        })
        .catch((err) => {
            console.error("Error:", err);
            // Show error screen when AI request fails
            movingFoward(loading, error)
        });
}
retry_button.addEventListener("click", () => {
    movingFoward(error, loading)
    setTimeout(() => {
        getMovies()
    }, 5000)
})
