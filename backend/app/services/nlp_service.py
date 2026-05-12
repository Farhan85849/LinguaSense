import re
import os
import pickle
import numpy as np
from typing import List, Dict, Tuple

# Roman Urdu word lists
ROMAN_URDU_WORDS = {
    "kal", "aaj", "karna", "karo", "kar", "hai", "hain", "tha", "thi", "the",
    "mein", "main", "mujhe", "mujhko", "tumhe", "tumhara", "tumhari", "tera",
    "teri", "mera", "meri", "apna", "apni", "yeh", "woh", "kya", "kyun",
    "kaise", "kab", "kahan", "kaun", "kitna", "kitni", "bahut", "thoda",
    "zyada", "kam", "acha", "bura", "theek", "sahi", "galat", "nahi", "nahin",
    "haan", "ji", "bilkul", "zaroor", "shayad", "lagta", "lagti", "chahiye",
    "chahta", "chahti", "dena", "lena", "jana", "aana", "jao", "aao",
    "bhai", "yaar", "dost", "pyaar", "mohabbat", "zindagi", "duniya",
    "ghar", "school", "kaam", "paisa", "waqt", "din", "raat", "subah",
    "shaam", "khana", "pani", "chai", "doodh", "roti", "sab", "kuch",
    "sirf", "bas", "phir", "abhi", "pehle", "baad", "saath", "bina",
    "lekin", "magar", "aur", "ya", "toh", "bhi", "hi", "se", "ko",
    "ne", "ka", "ki", "ke", "par", "pe", "mujh", "tum", "hum", "aap",
    "unhe", "unka", "unki", "inhe", "inka", "inki", "jab", "tab",
    "agar", "toh", "warna", "kyunke", "isliye", "matlab", "samajh",
    "dekho", "suno", "bolo", "batao", "pata", "maloom", "yaad", "bhool",
    "rona", "hasna", "khush", "udaas", "gussa", "darr", "himmat",
    "mushkil", "asaan", "mushkil", "problem", "solution", "koshish",
    "mehnat", "kamyabi", "nakamyabi", "umeed", "asha", "sapna",
    "submit", "assignment", "project", "class", "teacher", "student",
    "padhai", "likhai", "parho", "likho", "seekho", "sikhao",
    "achha", "bura", "sundar", "khoobsurat", "badsoorat", "mota", "patla",
    "lamba", "chota", "bara", "naya", "purana", "taza", "banda", "larki",
    "larka", "aurat", "mard", "bacha", "buzurg", "jawaan", "dil", "dimaag",
    "haath", "pair", "aankh", "kaan", "naak", "muh", "sar", "peeth",
    "roz", "har", "koi", "sab", "kuch", "bohot", "itna", "utna",
    "wahan", "yahan", "idhar", "udhar", "upar", "neeche", "andar", "bahar",
    "agay", "peeche", "seedha", "ulta", "dono", "teeno", "sab",
    "ek", "do", "teen", "chaar", "paanch", "chhe", "saat", "aath", "nau", "das"
}

URDU_SCRIPT_PATTERN = re.compile(r'[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]')
ARABIC_SCRIPT_PATTERN = re.compile(r'[\u0600-\u06FF]')
HINDI_SCRIPT_PATTERN = re.compile(r'[\u0900-\u097F]')

TOXIC_WORDS = {
    "idiot", "stupid", "fool", "dumb", "moron", "hate", "kill", "die",
    "ugly", "loser", "pathetic", "worthless", "useless", "shut up",
    "bakwas", "bewakoof", "gadha", "ullu", "pagal", "harami", "kamina",
    "ganda", "bekar", "chup", "besharam", "badtameez", "zalim"
}

POSITIVE_WORDS = {
    "good", "great", "excellent", "amazing", "wonderful", "fantastic",
    "love", "happy", "joy", "beautiful", "awesome", "perfect", "best",
    "acha", "achha", "khush", "pyaar", "mohabbat", "sundar", "khoobsurat",
    "mast", "zabardast", "kamaal", "shaandaar", "behtareen", "umda",
    "shukriya", "shukria", "meherbaan", "dil", "zindagi", "khushi"
}

NEGATIVE_WORDS = {
    "bad", "terrible", "awful", "horrible", "worst", "hate", "sad",
    "angry", "upset", "disappointed", "fail", "wrong", "problem",
    "bura", "kharab", "udaas", "gussa", "ghalat", "mushkil", "takleef",
    "dard", "rona", "bura", "bekar", "nakaam", "pareshaan", "dukh"
}

def detect_script(text: str) -> str:
    urdu_count = len(URDU_SCRIPT_PATTERN.findall(text))
    hindi_count = len(HINDI_SCRIPT_PATTERN.findall(text))
    if urdu_count > 0 and urdu_count >= hindi_count:
        return "urdu_script"
    if hindi_count > 0:
        return "hindi_script"
    return "latin"

def classify_word(word: str) -> str:
    w = word.lower().strip(".,!?;:'\"")
    if URDU_SCRIPT_PATTERN.search(w):
        return "Urdu"
    if HINDI_SCRIPT_PATTERN.search(w):
        return "Hindi"
    if ARABIC_SCRIPT_PATTERN.search(w) and not HINDI_SCRIPT_PATTERN.search(w):
        return "Arabic"
    if w in ROMAN_URDU_WORDS:
        return "Roman Urdu"
    if re.match(r'^[a-zA-Z]+$', w) and len(w) > 0:
        return "English"
    return "Unknown"

def detect_language(text: str) -> Tuple[str, float, bool]:
    words = text.split()
    if not words:
        return "Unknown", 0.0, False

    script = detect_script(text)
    if script == "urdu_script":
        return "Urdu", 0.95, False
    if script == "hindi_script":
        return "Hindi", 0.95, False

    word_langs = [classify_word(w) for w in words]
    lang_counts: Dict[str, int] = {}
    for lang in word_langs:
        if lang != "Unknown":
            lang_counts[lang] = lang_counts.get(lang, 0) + 1

    if not lang_counts:
        return "Unknown", 0.5, False

    total = sum(lang_counts.values())
    roman_urdu = lang_counts.get("Roman Urdu", 0)
    english = lang_counts.get("English", 0)

    is_code_mixed = roman_urdu > 0 and english > 0 and min(roman_urdu, english) / total > 0.15

    dominant = max(lang_counts, key=lang_counts.get)
    confidence = lang_counts[dominant] / total

    if is_code_mixed:
        if roman_urdu >= english:
            return "Roman Urdu (Code-Mixed)", round(confidence, 2), True
        return "English (Code-Mixed)", round(confidence, 2), True

    if dominant == "Roman Urdu":
        return "Roman Urdu", round(confidence, 2), False
    if dominant == "English":
        try:
            from langdetect import detect as ld_detect
            detected = ld_detect(text)
            lang_map = {"en": "English", "ur": "Urdu", "hi": "Hindi", "ar": "Arabic", "fr": "French", "de": "German"}
            return lang_map.get(detected, "English"), round(confidence, 2), False
        except:
            return "English", round(confidence, 2), False

    return dominant, round(confidence, 2), False

def analyze_sentiment(text: str) -> Tuple[str, float]:
    words = set(text.lower().split())
    pos = len(words & POSITIVE_WORDS)
    neg = len(words & NEGATIVE_WORDS)
    total = pos + neg
    if total == 0:
        return "Neutral", 0.5
    score = pos / total
    if score > 0.6:
        return "Positive", round(score, 2)
    if score < 0.4:
        return "Negative", round(1 - score, 2)
    return "Neutral", 0.5

def detect_toxicity(text: str) -> Tuple[float, List[str]]:
    words = text.lower().split()
    found_toxic = [w for w in words if w.strip(".,!?") in TOXIC_WORDS]
    score = min(len(found_toxic) / max(len(words), 1) * 3, 1.0)
    return round(score, 2), list(set(found_toxic))

def get_word_analysis(text: str) -> List[Dict]:
    words = text.split()
    return [{"word": w, "language": classify_word(w)} for w in words if w.strip()]

def get_language_distribution(text: str) -> Dict[str, float]:
    words = text.split()
    if not words:
        return {}
    lang_counts: Dict[str, int] = {}
    for w in words:
        lang = classify_word(w)
        if lang != "Unknown":
            lang_counts[lang] = lang_counts.get(lang, 0) + 1
    total = sum(lang_counts.values()) or 1
    return {lang: round(count / total * 100, 1) for lang, count in lang_counts.items()}

def get_translation_suggestion(text: str, detected_lang: str) -> str:
    if "Roman Urdu" in detected_lang or "Code-Mixed" in detected_lang:
        return "Translation to standard Urdu or English available via premium API integration."
    return ""

def analyze_text(text: str) -> Dict:
    detected_lang, confidence, is_code_mixed = detect_language(text)
    sentiment, sentiment_score = analyze_sentiment(text)
    toxicity_score, toxic_words = detect_toxicity(text)
    word_analysis = get_word_analysis(text)
    lang_dist = get_language_distribution(text)
    translation = get_translation_suggestion(text, detected_lang)

    return {
        "detected_language": detected_lang,
        "confidence": confidence,
        "sentiment": sentiment,
        "sentiment_score": sentiment_score,
        "toxicity_score": toxicity_score,
        "toxic_words": toxic_words,
        "word_analysis": word_analysis,
        "language_distribution": lang_dist,
        "translation_suggestion": translation,
        "is_code_mixed": is_code_mixed
    }
