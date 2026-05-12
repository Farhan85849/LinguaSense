"""
LinguaSense AI - Model Training Script
Trains TF-IDF + Naive Bayes and Logistic Regression classifiers
"""
import os, pickle, json
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.pipeline import Pipeline

DATASET_PATH = os.path.join(os.path.dirname(__file__), "..", "datasets", "language_dataset.csv")
MODEL_DIR = os.path.dirname(__file__)

TRAINING_DATA = [
    # English
    ("Hello how are you doing today", "English"),
    ("I am going to the market", "English"),
    ("The weather is very nice today", "English"),
    ("Please submit your assignment by tomorrow", "English"),
    ("Can you help me with this problem", "English"),
    ("I love programming and technology", "English"),
    ("The project deadline is next week", "English"),
    ("Good morning everyone have a great day", "English"),
    ("She is working on a new project", "English"),
    ("We need to finish this before evening", "English"),
    ("The meeting is scheduled for Monday", "English"),
    ("Please review the document carefully", "English"),
    ("I will send you the report soon", "English"),
    ("Thank you for your help and support", "English"),
    ("The application is running smoothly now", "English"),
    # Roman Urdu
    ("Kal assignment submit karna hai", "Roman Urdu"),
    ("Aaj bahut thakaan ho gayi hai", "Roman Urdu"),
    ("Yaar kya haal hai tumhara", "Roman Urdu"),
    ("Mujhe pata nahi kya karna chahiye", "Roman Urdu"),
    ("Ghar kab aao ge tum", "Roman Urdu"),
    ("Bahut mushkil kaam hai yeh", "Roman Urdu"),
    ("Theek hai main kal milta hoon", "Roman Urdu"),
    ("Kya tum school ja rahe ho", "Roman Urdu"),
    ("Mera dil nahi lag raha padhai mein", "Roman Urdu"),
    ("Yeh project bahut acha hai", "Roman Urdu"),
    ("Bhai kahan ho tum abhi", "Roman Urdu"),
    ("Aaj chai peeni hai saath mein", "Roman Urdu"),
    ("Kal raat bahut neend nahi aayi", "Roman Urdu"),
    ("Tumhara kaam bahut behtareen hai", "Roman Urdu"),
    ("Main zaroor aaunga kal", "Roman Urdu"),
    # Code-Mixed
    ("Kal mujhe assignment submit karni hai deadline hai", "Code-Mixed"),
    ("Yaar yeh project bahut difficult hai", "Code-Mixed"),
    ("Main office ja raha hoon meeting hai", "Code-Mixed"),
    ("Aaj presentation deni hai class mein", "Code-Mixed"),
    ("Bhai please help karo mujhe", "Code-Mixed"),
    ("Yeh problem solve nahi ho rahi", "Code-Mixed"),
    ("Main kal free hoon lets meet", "Code-Mixed"),
    ("Bahut tired hoon aaj rest karna hai", "Code-Mixed"),
    ("Yeh idea bahut creative hai", "Code-Mixed"),
    ("Kya tum available ho tomorrow", "Code-Mixed"),
    # Urdu (script)
    ("آج موسم بہت اچھا ہے", "Urdu"),
    ("میں کل آپ سے ملوں گا", "Urdu"),
    ("یہ کام بہت مشکل ہے", "Urdu"),
    ("آپ کا شکریہ بہت مہربانی", "Urdu"),
    ("میرا نام احمد ہے", "Urdu"),
    # Hindi
    ("आज मौसम बहुत अच्छा है", "Hindi"),
    ("मुझे कल जाना है", "Hindi"),
    ("यह काम बहुत मुश्किल है", "Hindi"),
    ("आपका धन्यवाद", "Hindi"),
    # Arabic
    ("مرحبا كيف حالك اليوم", "Arabic"),
    ("شكرا جزيلا على مساعدتك", "Arabic"),
    ("أنا بخير والحمد لله", "Arabic"),
    # French
    ("Bonjour comment allez vous aujourd hui", "French"),
    ("Je suis tres content de vous voir", "French"),
    ("Merci beaucoup pour votre aide", "French"),
]

def load_or_create_dataset():
    if os.path.exists(DATASET_PATH):
        df = pd.read_csv(DATASET_PATH)
        print(f"Loaded dataset: {len(df)} samples")
    else:
        df = pd.DataFrame(TRAINING_DATA, columns=["text", "language"])
        os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
        df.to_csv(DATASET_PATH, index=False)
        print(f"Created dataset: {len(df)} samples")
    return df

def train_models():
    df = load_or_create_dataset()
    X, y = df["text"].tolist(), df["language"].tolist()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y if len(set(y)) > 1 else None)

    nb_pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 4), max_features=10000)),
        ("clf", MultinomialNB(alpha=0.1))
    ])
    lr_pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 4), max_features=10000)),
        ("clf", LogisticRegression(max_iter=1000, C=1.0, random_state=42))
    ])

    nb_pipeline.fit(X_train, y_train)
    lr_pipeline.fit(X_train, y_train)

    nb_preds = nb_pipeline.predict(X_test)
    lr_preds = lr_pipeline.predict(X_test)

    metrics = {
        "naive_bayes": {
            "accuracy": round(accuracy_score(y_test, nb_preds), 4),
            "report": classification_report(y_test, nb_preds, output_dict=True, zero_division=0)
        },
        "logistic_regression": {
            "accuracy": round(accuracy_score(y_test, lr_preds), 4),
            "report": classification_report(y_test, lr_preds, output_dict=True, zero_division=0)
        }
    }

    with open(os.path.join(MODEL_DIR, "nb_model.pkl"), "wb") as f:
        pickle.dump(nb_pipeline, f)
    with open(os.path.join(MODEL_DIR, "lr_model.pkl"), "wb") as f:
        pickle.dump(lr_pipeline, f)
    with open(os.path.join(MODEL_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"Naive Bayes Accuracy: {metrics['naive_bayes']['accuracy']}")
    print(f"Logistic Regression Accuracy: {metrics['logistic_regression']['accuracy']}")
    print("Models saved successfully!")
    return metrics

if __name__ == "__main__":
    train_models()
