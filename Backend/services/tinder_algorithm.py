import os
import sys
# um models und database fehlerfrei importieren zu können
today_dir = os.path.dirname(__file__)
sys.path.insert(0, os.path.abspath(os.path.join(today_dir, '..')))
sys.path.insert(0, os.path.abspath(os.path.join(today_dir, '..', '..')))

from sqlalchemy import func
from models import UserToBooks 
from database import db
import requests
import Orange # hoffentlich klappt dies
import numpy as np
import math
from Orange.data import Table, Domain, StringVariable, DiscreteVariable
from Orange.preprocess import Continuize
from Orange.distance import Euclidean
from Orange.clustering.hierarchical import HierarchicalClustering
from Orange.classification import TreeLearner

# Google Books API
GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"
MAX_RESULTS_PER_PAGE = 10

def fetch_training_books(search_terms: list[str], pages_per_query: int = 2) -> Table:
    """
     Trainingsdaten via Google Books API für eine Liste von Suchbegriffen. Ähnlichkeit zu Passage von Otto.
    
    """
    meta_vars = [StringVariable(name) for name in [
        "volume_id", "title", "authors", "thumbnail",
        "isbn", "info_link", "categories", "language"
    ]]
    domain = Domain([], metas=meta_vars)
    result_rows = []

    for term in search_terms:
        for page in range(pages_per_query):
            try:
                r = requests.get(GOOGLE_BOOKS_API, params={
                    "q": term,
                    "startIndex": page * MAX_RESULTS_PER_PAGE,
                    "maxResults": MAX_RESULTS_PER_PAGE
                }, timeout=10)
                r.raise_for_status()
                books = r.json().get("items", [])
                for entry in books:
                    info = entry.get("volumeInfo", {})
                    volume_id = entry.get("id", "N/A")
                    isbn = next((x.get("identifier") for x in info.get("industryIdentifiers", [])
                                if x.get("type") == "ISBN_13"), "N/A")
                    result_rows.append([
                        volume_id,
                        info.get("title", "N/A"),
                        ", ".join(info.get("authors", [])) or 'N/A',
                        info.get("imageLinks", {}).get("thumbnail", "N/A"),
                        isbn,
                        f"https://books.google.de/books?id={volume_id}",
                        ", ".join(info.get("categories", [])) or 'N/A',
                        info.get("language", "N/A")
                    ])
            except requests.exceptions.RequestException as e:
                print(f"API-Fehler bei Begriff '{term}': {e}")
            except Exception as e:
                print(f"Anderer Fehler bei '{term}': {e}") # für Prototyp wäre auch Fehlerbehandlung über continue vermutlich ausreichend
    return Table.from_list(domain, result_rows)

def transform_domain(table: Table) -> Table:
    """Konvertiert Meta-Strings in diskrete Attribute für Orange. Notwendigkeit aus Orange Workflows ersichtlich."""
    colnames = ["volume_id", "title", "authors", "thumbnail",
                "isbn", "info_link", "categories", "language"]
    zipped = list(zip(*table.metas))
    attr_vars, encoded = [], []

    for name, column in zip(colnames, zipped):
        try:
            var = DiscreteVariable.make(name, sorted(set(column)))
            attr_vars.append(var)
            encoded.append([var.to_val(v) for v in column])
        except Exception as e:
            print(f"Fehler bei Spalte '{name}': {e}")
            continue

    domain = Domain(attributes=attr_vars, metas=table.domain.metas)
    values = list(zip(*encoded))
    return Table.from_list(domain, values, metas=table.metas)

def build_cluster_model(search_terms: list[str], k: int = 100): #Anzahl der Cluster/ bei theoretisch 1000 Büchern geeignet
    """
    Clustermodell und Entscheidungsbaum mit cluster-Labels als Target(siehe Orange Workflows)
    """
    training_data = fetch_training_books(search_terms)
    discrete = transform_domain(training_data)
    continuous = Continuize()(discrete)
    dist = Euclidean(continuous)
    hc = HierarchicalClustering(n_clusters=k)
    cluster_labels = hc.fit_predict(dist).astype(int)

    cluster_map = {
        discrete.metas[i][0]: cluster_labels[i]
        for i in range(len(discrete))
    }

    unique_labels = sorted(set(cluster_labels))
    class_var = DiscreteVariable("cluster", values=[str(l) for l in unique_labels])
    cls_domain = Domain(discrete.domain.attributes, class_vars=[class_var])
    Y = np.array([str(lbl) for lbl in cluster_labels]).reshape(-1, 1)
    table = Table.from_numpy(cls_domain, discrete.X, Y)
    classifier = TreeLearner()(table)

    return cluster_map, classifier, cls_domain, discrete

# INITIALISIERUNG
# Bewusste Wahl der Suchbegriffe, um möglichst breit, treffende Vorhersagen zu ermöglichen. (Sprachverhältnis zehn zu vierzig, basierend auf Schätzung der Relevanz beider Sprachen für User)
search_terms = [
    # Deutsch
    "epischer Roman", "Abenteuerroman", "Saga", "Legende", "Mythos",
    "Heldenreise", "Epos", "Familienepos", "Historischer Roman", "Fantasy-Epos",
    # English 
    "Dystopia", "High Fantasy", "Low Fantasy", "Urban Fantasy", "Science Fiction Epic",
    "Future Vision", "War Novel", "Lords of the World", "Realm of Gods", "Fate Novel",
    "Travelogue", "Adventure Saga", "Arcane Worlds", "Magical Conflict", "Epic Battles",
    "Family Chronicle", "Dynasty", "Medieval Saga", "Time-travel Epic", "Legendary Tale",
    "Heroic Epic", "Kingdom Drama", "Gods’ War", "Dragon War", "Sea Adventure",
    "Explorer’s Novel", "Survival Story", "Pioneer Drama", "Epic Love Story",
    "Riddles and Intrigue", "Thriller Epic", "Political Novel", "Cultural Conflict",
    "Journey of Fate", "Lost Realms", "Forgotten Worlds", "Fairy-tale Legend",
    "Mythic Lore", "Saga of Heroes", "Chronicle of Heroes"
]
cluster_map, cluster_clf, cluster_domain, discrete_data = build_cluster_model(search_terms, k=100)
def get_book_details(volume_id: str) -> list[str]:
    """Lädt Details zu einem einzelnen Buch anhand der volume_id von Google Books API. Nötig zur Klassifizierung durch den Baum/Features."""
    try:
        r = requests.get(f"{GOOGLE_BOOKS_API}/{volume_id}", timeout=10)
        r.raise_for_status()
        info = r.json().get("volumeInfo", {})
        isbn = next((x.get("identifier") for x in info.get("industryIdentifiers", [])
                     if x.get("type") == "ISBN_13"), "N/A")
        return [
            volume_id,
            info.get("title", "N/A"),
            ", ".join(info.get("authors", [])) or 'N/A',
            info.get("imageLinks", {}).get("thumbnail", "N/A"),
            isbn,
            f"https://books.google.de/books?id={volume_id}",
            ", ".join(info.get("categories", [])) or 'N/A',
            info.get("language", "N/A")
        ]
    except requests.exceptions.RequestException as e:
        print(f"Fehler bei API-Anfrage für Buch-ID '{volume_id}': {e}")
    except Exception as e:
        print(f"Allgemeiner Fehler bei get_book_details('{volume_id}'): {e}")
    return None
def cluster_books(vol_ids: list[str], k: int = 100) -> dict[str,int]:
    """Zuweisung der Cluster. Vermeiden unnötigen Rechenaufwands durch Überprüfung, ob Klassifizierung bereits stattgfunden hat. Längerfristig persistente Speicherung sinnvoll"""
    results = {}
    for vid in vol_ids:
        if vid in cluster_map:
            results[vid] = cluster_map[vid]
        else:
            try:
                detail = get_book_details(vid)
                if not detail:
                    results[vid] = None
                    continue
                meta_only = Domain([], metas=cluster_domain.metas)
                single_row = Table.from_list(meta_only, [detail])
                transformed = transform_domain(single_row)
                processed = Continuize()(transformed)
                prediction = cluster_clf(processed)[0]
                value = int(prediction.value) if str(prediction.value).isdigit() else None
                results[vid] = value
                if value is not None:
                    cluster_map[vid] = value
            except Exception as e:
                print(f"Fehler bei Klassifikation von '{vid}': {e}")
                results[vid] = None
    return results

def find_similar_users(user_id: int, k: int = 100) -> list[int]:
    """Top-10 Nutzer basierend auf Überschneidung der Buch-Cluster. Aufzurufende Methode für Ermittlung der anzuzeigenden User"""
    try:
        user_books = [
            v for (v,) in db.session.query(UserToBooks.volume_id)
            .filter(UserToBooks.user_id == user_id).all()
        ]
    except Exception as e:
        print(f"Fehler beim Abrufen der Bücher für User {user_id}: {e}")
        return []

    if not user_books:
        return []

    user_clusters = set(cluster_books(user_books, k).values())

    try:
        other_users = [
            u for (u,) in db.session.query(UserToBooks.user_id).distinct().all()
            if u != user_id
        ]
    except Exception as e:
        print(f"Fehler beim Abrufen anderer Nutzer: {e}")
        return []

    scores = {}
    for other in other_users:
        try:
            books = [
                v for (v,) in db.session.query(UserToBooks.volume_id)
                .filter(UserToBooks.user_id == other).all()
            ]
            overlap = len(user_clusters & set(cluster_books(books, k).values()))
            if overlap > 0:
                scores[other] = overlap
        except Exception as e:
            print(f"Fehler bei Verarbeitung von User {other}: {e}")
            continue

    return [u for u, _ in sorted(scores.items(), key=lambda x: x[1], reverse=True)[:10]]
