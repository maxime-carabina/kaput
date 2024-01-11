from flask import Blueprint, jsonify
quiz_bp = Blueprint('quiz', __name__)

from flask import Flask, request
from SPARQLWrapper import SPARQLWrapper, JSON
import random
import requests
import json

def get_albums_by_artist(artist_name):
    artist_id = get_wikidata_artist_id(artist_name)
    if not artist_id:
        return "Artist not found"

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = f"""
    SELECT ?album ?albumLabel ?releaseDate WHERE {{
      ?album wdt:P31 wd:Q482994;  # Instance of album
             wdt:P175 wd:{artist_id}; # Performed by the artist
             wdt:P577 ?releaseDate.   # Release date of the album
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    ORDER BY ?releaseDate
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    albums = [{"album": result['albumLabel']['value'], "release_year": result['releaseDate']['value'][:4]} for result in results["results"]["bindings"]]
    return albums if albums else f"No albums found for {artist_name}"



def get_artist_awards(artist_name):
    artist_id = get_wikidata_artist_id(artist_name)
    if not artist_id:
        return "Artist not found"

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = f"""
    SELECT ?award ?awardLabel ?dateReceived WHERE {{
      wd:{artist_id} p:P166 ?awardStatement.
      ?awardStatement ps:P166 ?award;
                      pq:P585 ?dateReceived.  # P585 is the property for point in time (date of award)
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    awards = [{"award": result['awardLabel']['value'], "date_received": result['dateReceived']['value']} for result in results["results"]["bindings"]]
    return awards if awards else "No awards found for the artist"




def get_artist_information(artist_name):
    artist_id = get_wikidata_artist_id(artist_name)
    if not artist_id:
        return "Artist not found"

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = f"""
    SELECT ?artist ?artistLabel ?dateOfBirth ?placeOfBirthLabel ?genreLabel WHERE {{
      BIND(wd:{artist_id} AS ?artist)
      ?artist wdt:P31 wd:Q5;  # Instance of human
              rdfs:label ?artistLabel;
              wdt:P569 ?dateOfBirth;  # Date of birth
              wdt:P19 ?placeOfBirth;   # Place of birth
              wdt:P136 ?genre.         # Genre
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    LIMIT 1
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    artist_info = next(iter(results["results"]["bindings"]), None)
    if artist_info:
        return {
            "name": artist_info['artistLabel']['value'],
            "date_of_birth": artist_info['dateOfBirth']['value'],
            "place_of_birth": artist_info['placeOfBirthLabel']['value'],
            "genre": artist_info['genreLabel']['value']
        }
    else:
        return "No information found for the artist"


def get_tracks_by_artist(artist_name):
    artist_id = get_wikidata_artist_id(artist_name)
    if not artist_id:
        return "Artist not found", [], None  # Return a tuple for consistency

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = f"""
    SELECT ?work ?workLabel WHERE {{
      {{ ?work wdt:P31 wd:Q2188189; wdt:P175 wd:{artist_id}. }} # Musical works performed by the artist
      UNION
      {{ ?work wdt:P31 wd:Q134556; wdt:P175 wd:{artist_id}. }} # Singles performed by the artist
      UNION
      {{ ?work wdt:P31 wd:Q2188189; wdt:P170 wd:{artist_id}. }} # Musical works where the artist is the creator
      UNION
      {{ ?work wdt:P31 wd:Q134556; wdt:P170 wd:{artist_id}. }} # Singles where the artist is the creator
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    LIMIT 100
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    # Adjusted to 'work' based on the query above
    tracks = [(result['work']['value'], result['workLabel']['value']) for result in results["results"]["bindings"]]
    if tracks:
        # Use random.choice to select a random track as the correct answer
        correct_answer = random.choice(tracks)
        return None, tracks, correct_answer
    else:
        return f"No tracks found for {artist_name}", [], None



def get_wikidata_artist_id(artist_name):
    endpoint = "https://www.wikidata.org/w/api.php"
    params = {
        "action": "wbsearchentities",
        "format": "json",
        "language": "en",
        "type": "item",
        "search": artist_name
    }
    response = requests.get(endpoint, params=params)
    data = response.json()

    if data["search"]:
        artist_id = data["search"][0]["id"]
        print(f"Artist ID for '{artist_name}': {artist_id}")  # Print the artist ID
        return artist_id
    else:
        print(f"No ID found for artist '{artist_name}'")
        return None

def generate_question(artist):
    _, tracks, correct_answer = get_tracks_by_artist(artist)

    if not tracks:
        return "No tracks found for the artist", [], None

    options = [correct_answer]
    random.shuffle(options)  # Shuffle the combined options

    question = f"Which of these tracks is by {artist}?"
    
    # Extract the labels for display purposes
    option_labels = [option[1] for option in options]
    correct_answer_label = correct_answer[1]

    return question, option_labels, correct_answer_label

def generate_album_question(artist_name):
    albums = get_albums_by_artist(artist_name)

    if not albums:
        return "No album found for this artist in the specified year", [], None

    # Choose a random album from the list as the correct answer
    correct_album = random.choice(albums)['album']

    # Generate dummy album names for incorrect answers
    incorrect_albums = ["Album A", "Album B", "Album C"]  # Replace with more realistic names

    # Combine correct and incorrect answers
    options = [correct_album] + incorrect_albums
    random.shuffle(options)

    question = f"Which of these albums was released by {artist_name}?"

    return question, options, correct_album


def generate_award_question(artist_name):
    artist_awards = get_artist_awards(artist_name)
    
    if not artist_awards or artist_awards == "No awards found for the artist":
        return "No awards found for the artist", [], None

    # Choose a random award from the list
    correct_award = random.choice(artist_awards)
    correct_year = correct_award['date_received'][:4]  # Extract only the year

    # Generate unique dummy years for incorrect answers
    incorrect_years = set()
    while len(incorrect_years) < 3:
        dummy_year = str(int(correct_year) + random.randint(-5, 5))
        if dummy_year != correct_year:
            incorrect_years.add(dummy_year)

    # Combine correct and incorrect answers
    options = [correct_year] + list(incorrect_years)
    random.shuffle(options)  # Shuffle the combined options

    question = f"When did {artist_name} receive the {correct_award['award']}?"

    return question, options, correct_year




#########################ROUTES#################################

@quiz_bp.route('/test', methods=['GET'])
def test():
    return "Test successful"


@quiz_bp.route('/post-quiz', methods=['POST'])
def submit_quiz():
    data = request.json  
    with open('quiz.json', 'w') as file:
        json.dump(data, file, indent=4)

    return jsonify({"message": "Quiz results saved successfully."})

@quiz_bp.route('/start/<artist_name>', methods=['POST'])
def start_quiz(artist_name):
    # Generate song question
    song_question_data = get_question(artist_name)

    # Generate award question
    award_question_data = get_award_question(artist_name)

    # Generate album question
    album_question_data = get_album_question(artist_name)

    # Combine both questions in the response and return as JSON
    response = {
        "song_question": song_question_data,
        "award_question": award_question_data,
        "album_question": album_question_data
    }
    
    return jsonify(response)

def get_question(artist_name):
    question, options, correct_answer = generate_question(artist_name)
    return {
        "question": question,
        "options": options,
        "correct_answer": correct_answer  
    }

def get_award_question(artist_name):
    question, options, correct_answer = generate_award_question(artist_name)
    return {
        "question": question,
        "options": options,
        "correct_answer": correct_answer  
    }

def get_album_question(artist_name):
    question, options, correct_answer = generate_album_question(artist_name)
    return {
        "question": question,
        "options": options,
        "correct_answer": correct_answer 
    }