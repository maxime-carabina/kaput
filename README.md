# Quiz Blueprint Route: `Kaput`


## Endpoint Details

- **HTTP Method:** GET

- **Endpoint URL:** `127.0.0.1:8080/start/<artist_name>`

- **Parameters:**
  - `artist_name` (string, required): The name of the artist for whom quiz questions are generated. This parameter is part of the URL and specifies the artist's name.

## Data Required

- **Input:**
  - `artist_name` (string): The artist's name, passed as a URL parameter.

## Data Sent

- **Output:**
  - The endpoint sends a JSON response containing two types of quiz questions:
    1. **song_question** (object): Information related to a song question generated for the artist.
       - This includes details like the song title, artist, and other relevant information required for the quiz question.
    2. **award_question** (object): Information related to an award question generated for the artist.
       - This includes details about an award received by the artist and other relevant information required for the quiz question.

- Example JSON Response:
  ```json
  {
      "song_question": {
          "question": question,
          "options": options,
          "correct_answer": correct_answer  
      },
      "award_question": {
          "question": question,
          "options": options,
          "correct_answer": correct_answer 
      }
  }

  
## Endpoint Description

This route is part of a Flask application, specifically a Blueprint named "quiz_bp." It defines an endpoint `/post-quiz` that accepts HTTP POST requests. When a client makes a POST request to this endpoint, it receives JSON data containing quiz results, which are then saved to a file named "quiz.json." The endpoint responds with a confirmation message upon successful saving of the quiz results.

## Endpoint Details

- **HTTP Method:** POST

- **Endpoint URL:** `127.0.0.1:8080/post-quiz`

- **Parameters:**
  - None

## Data Required

- **Input:**
  - The endpoint expects a JSON payload in the POST request body containing quiz results data.

## Data Sent

- **Output:**
  - The endpoint sends a JSON response indicating the status of the quiz results saving process.
    - `"message"` (string): A message confirming the successful saving of quiz results.

- Example JSON Response:
  ```json
  {
      "message": "Quiz results saved successfully."
  }
