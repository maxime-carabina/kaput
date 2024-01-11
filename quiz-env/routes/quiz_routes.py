from flask import Blueprint, jsonify
quiz_bp = Blueprint('quiz', __name__)

from flask import Flask, request
from SPARQLWrapper import SPARQLWrapper, JSON
import random
import requests
import json

def get_artist_collaborators(artist_name):
    artist_id = get_wikidata_artist_id(artist_name)
    if not artist_id:
        return "Artist not found"

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = f"""
    SELECT DISTINCT ?collaborator ?collaboratorLabel WHERE {{
        ?work wdt:P175 wd:{artist_id};  # Works performed by the artist
              wdt:P175 ?collaborator.   # Other performers on the work
        ?collaborator wdt:P31 wd:Q5.   # Collaborator is a human
        FILTER(?collaborator != wd:{artist_id})
        SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    collaborators = [{"name": result['collaboratorLabel']['value']} for result in results["results"]["bindings"]]
    return collaborators if collaborators else "No collaborators found for the artist"


def get_career_start_year(artist_name):
    artist_id = get_wikidata_artist_id(artist_name)
    if not artist_id:
        return "Artist not found"

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = f"""
    SELECT ?startYear WHERE {{
        wd:{artist_id} wdt:P31 wd:Q5;  # Instance of human
                        wdt:P106 wd:Q639669;  # Occupation: musician
                        wdt:P2031 ?startYear.  # Date of earliest work
        SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    ORDER BY ?startYear
    LIMIT 1
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    career_start = next(iter(results["results"]["bindings"]), None)
    if career_start:
        return career_start['startYear']['value'][:4]
    else:
        return "Career start year not found for the artist"


def get_artist_nationality(artist_name):
    artist_id = get_wikidata_artist_id(artist_name)
    if not artist_id:
        return "Artist not found"

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = f"""
    SELECT ?country ?countryLabel WHERE {{
        wd:{artist_id} wdt:P27 ?country.  # P27 is the property for country of citizenship
        SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    nationality = next(iter(results["results"]["bindings"]), None)
    if nationality:
        return nationality['countryLabel']['value']
    else:
        return "Nationality not found for the artist"


def get_famous_song_by_artist(artist_name):
    artist_id = get_wikidata_artist_id(artist_name)
    if not artist_id:
        return "Artist not found"

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = f"""
    SELECT ?song ?songLabel WHERE {{
        ?song wdt:P31 wd:Q2188189;  # Instance of a musical work
              wdt:P175 wd:{artist_id}. # Performed by the artist
        ?song wdt:P166 ?award.  # The song has received an award
        SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    LIMIT 1
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    famous_song = next(iter(results["results"]["bindings"]), None)
    if famous_song:
        return famous_song['songLabel']['value']
    else:
        return "No famous song found for the artist"


def get_artist_first_record_label(artist_name):
    artist_id = get_wikidata_artist_id(artist_name)
    if not artist_id:
        return "Artist not found"

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = f"""
    SELECT ?recordLabel ?recordLabelLabel WHERE {{
        wd:{artist_id} wdt:P175 ?recordings.
        ?recordings wdt:P264 ?recordLabel.
        SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    GROUP BY ?recordLabel ?recordLabelLabel
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    record_labels = [{"label": result['recordLabelLabel']['value']} for result in results["results"]["bindings"]]
    return record_labels if record_labels else "No record label found for the artist"


def get_artist_primary_genre(artist_name):
    artist_id = get_wikidata_artist_id(artist_name)
    if not artist_id:
        return "Artist not found"

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = f"""
    SELECT ?genre ?genreLabel WHERE {{
      wd:{artist_id} wdt:P136 ?genre.  # P136 is the property for genre
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    genres = [{"genre": result['genreLabel']['value']} for result in results["results"]["bindings"]]
    return genres if genres else "No primary genre found for the artist"

def get_debut_album_year(artist_name):
    artist_id = get_wikidata_artist_id(artist_name)
    if not artist_id:
        return "Artist not found"

    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    query = f"""
    SELECT ?album ?albumLabel ?releaseDate WHERE {{
      ?album wdt:P31 wd:Q482994;  # Instance of an album
             wdt:P175 wd:{artist_id}; # Performed by the artist
             wdt:P577 ?releaseDate.   # Release date of the album
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    ORDER BY ?releaseDate
    LIMIT 1
    """
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    debut_album = next(iter(results["results"]["bindings"]), None)
    if debut_album:
        return {
            "album": debut_album['albumLabel']['value'],
            "release_year": debut_album['releaseDate']['value'][:4]
        }
    else:
        return "No debut album found for the artist"

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

    tracks = [(result['work']['value'], result['workLabel']['value']) for result in results["results"]["bindings"]]
    if tracks:
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
        print(f"Artist ID for '{artist_name}': {artist_id}")  
        return artist_id
    else:
        print(f"No ID found for artist '{artist_name}'")
        return None

def generate_question(artist):
    _, tracks, correct_answer = get_tracks_by_artist(artist)

    if not tracks:
        return "No tracks found for the artist", [], None

    options = [correct_answer]
    random.shuffle(options)  

    question = f"Which of these tracks is by {artist}?"
    
    option_labels = [option[1] for option in options]
    correct_answer_label = correct_answer[1]

    return question, option_labels, correct_answer_label

def generate_album_question(artist_name):
    albums = get_albums_by_artist(artist_name)

    if not albums:
        return "No album found for this artist in the specified year", [], None

    correct_album = random.choice(albums)['album']

    incorrect_albums = ["Album A", "Album B", "Album C"] 

    options = [correct_album] + incorrect_albums
    random.shuffle(options)

    question = f"Which of these albums was released by {artist_name}?"

    return question, options, correct_album


def generate_award_question(artist_name):
    artist_awards = get_artist_awards(artist_name)
    
    if not artist_awards or artist_awards == "No awards found for the artist":
        return "No awards found for the artist", [], None

    correct_award = random.choice(artist_awards)
    correct_year = correct_award['date_received'][:4] 

    incorrect_years = set()
    while len(incorrect_years) < 3:
        dummy_year = str(int(correct_year) + random.randint(-5, 5))
        if dummy_year != correct_year:
            incorrect_years.add(dummy_year)

    options = [correct_year] + list(incorrect_years)
    random.shuffle(options)  

    question = f"When did {artist_name} receive the {correct_award['award']}?"

    return question, options, correct_year

def generate_genre_question(artist_name):
    genres = get_artist_primary_genre(artist_name)

    if not genres:
        return "No primary genre found for this artist", [], None

    # Assuming the first genre is the primary one
    correct_genre = genres[0]['genre']

    # Generate dummy genres for incorrect answers
    incorrect_genres = ["Genre A", "Genre B", "Genre C"]  # Replace with more realistic names

    # Combine correct and incorrect answers
    options = [correct_genre] + incorrect_genres
    random.shuffle(options)

    question = f"Which genre is {artist_name} primarily known for?"

    return question, options, correct_genre


def generate_debut_album_question(artist_name):
    debut_album_info = get_debut_album_year(artist_name)

    if not debut_album_info:
        return "No debut album found for this artist", [], None

    correct_year = debut_album_info['release_year']

    # Generate dummy years for incorrect answers
    incorrect_years = [str(int(correct_year) + offset) for offset in [-1, 1, 2]]  # Example offsets

    # Combine correct and incorrect answers
    options = [correct_year] + incorrect_years
    random.shuffle(options)

    question = f"In what year did {artist_name} release their debut album?"

    return question, options, correct_year

def generate_record_label_question(artist_name):
    record_labels = get_artist_first_record_label(artist_name)  # This function needs to be implemented

    if not record_labels:
        return "No record label found for this artist", [], None

    correct_label = record_labels[0]  # Assuming the first one is the earliest

    # Generate dummy record labels for incorrect answers
    incorrect_labels = ["Label A", "Label B", "Label C"]

    # Combine correct and incorrect answers
    options = [correct_label] + incorrect_labels
    random.shuffle(options)

    question = f"Which record label did {artist_name} first sign with?"

    return question, options, correct_label

def generate_nationality_question(artist_name):
    nationality = get_artist_nationality(artist_name)

    if not nationality:
        return "Nationality not found for the artist", [], None

    # Assuming a few example nationalities for incorrect answers
    incorrect_nationalities = ["American", "British", "Canadian", "Australian"]

    # Ensure the correct answer is not in the incorrect answers
    incorrect_nationalities = [n for n in incorrect_nationalities if n != nationality]

    options = [nationality] + incorrect_nationalities[:3]
    random.shuffle(options)

    question = f"From which country is {artist_name}?"

    return question, options, nationality

def generate_famous_song_question(artist_name):
    famous_song = get_famous_song_by_artist(artist_name)

    if not famous_song:
        return "No famous song found for the artist", [], None

    # Generate dummy song titles for incorrect answers
    incorrect_songs = ["Song A", "Song B", "Song C"]

    options = [famous_song] + incorrect_songs
    random.shuffle(options)

    question = f"What is one of the most famous songs by {artist_name}?"

    return question, options, famous_song

def generate_career_question(artist_name):
    career_start_year = get_career_start_year(artist_name)

    # Check if a year was returned
    if career_start_year and career_start_year.isdigit():
        # Generate dummy years for incorrect answers
        incorrect_years = [str(int(career_start_year) + offset) for offset in [-1, 1, 2]]

        options = [career_start_year] + incorrect_years
        random.shuffle(options)

        question = f"When did {artist_name} start their career?"
        return question, options, career_start_year
    else:
        # Fallback to a collaboration question if career start year is not found
        return generate_collaboration_question(artist_name)



def generate_collaboration_question(artist_name):
    collaborators = get_artist_collaborators(artist_name)

    if not collaborators:
        return "No collaborators found for the artist", [], None

    # Choose a random collaborator as the correct answer
    correct_collaborator = random.choice(collaborators)['name']

    # Generate dummy names for incorrect answers
    incorrect_collaborators = ["Artist A", "Artist B", "Artist C"]  # Replace with more realistic names

    # Combine correct and incorrect answers
    options = [correct_collaborator] + incorrect_collaborators
    random.shuffle(options)

    question = f"Which artist collaborated with {artist_name}?"

    return question, options, correct_collaborator



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
    song_question_data = get_question(artist_name)
    award_question_data = get_award_question(artist_name)
    album_question_data = get_album_question(artist_name)
    song_question_data2 = get_question(artist_name)
    debut_question_data = get_debut_album_question(artist_name)
    genre_question_data = get_genre_question(artist_name)
    #record_label_question_data = get_record_label_question(artist_name)
    song_question_data3 = get_question(artist_name)
    nationality_question_data = get_nationality_question(artist_name)
    #famous_song_question_data = get_famous_song_question(artist_name)
    carreer_question_data = get_career_question(artist_name)
    colabortaion_question_data = get_collaboration_question(artist_name)

    # Combine all questions in the response and return as JSON
    response = {
        "song_question": song_question_data,
        "award_question": award_question_data,
        "album_question": album_question_data,
        "song2_question": song_question_data2,
        "debut_question": debut_question_data,
        "genre_question": genre_question_data,
        "song3_question": song_question_data3,
        #"record_label_question": record_label_question_data,
        "nationality_question": nationality_question_data,
        "career_question": carreer_question_data,
        "collaboration_qestion": colabortaion_question_data
        #"famous_song_question": famous_song_question_data
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

def get_debut_album_question(artist_name):
    question, options, correct_answer = generate_debut_album_question(artist_name)
    return {
        "question": question,
        "options": options,
        "correct_answer": correct_answer
    }

def get_genre_question(artist_name):
    question, options, correct_answer = generate_genre_question(artist_name)
    return {
        "question": question,
        "options": options,
        "correct_answer": correct_answer
    }

def get_record_label_question(artist_name):
    question, options, correct_answer = generate_record_label_question(artist_name)
    return {
        "question": question,
        "options": options,
        "correct_answer": correct_answer
    }

def get_nationality_question(artist_name):
    question, options, correct_answer = generate_nationality_question(artist_name)
    return {
        "question": question,
        "options": options,
        "correct_answer": correct_answer
    }

def get_famous_song_question(artist_name):
    question, options, correct_answer = generate_famous_song_question(artist_name)
    return {
        "question": question,
        "options": options,
        "correct_answer": correct_answer
    }

def get_career_question(artist_name):
    question, options, correct_answer = generate_career_question(artist_name)
    return {
        "question": question,
        "options": options,
        "correct_answer": correct_answer
    }

def get_collaboration_question(artist_name):
    question, options, correct_answer = generate_collaboration_question(artist_name)
    return {
        "question": question,
        "options": options,
        "correct_answer": correct_answer
    }
