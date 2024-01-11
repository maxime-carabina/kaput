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
