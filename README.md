# Unser Projekt

Das hier ist die Beschreibung unseres Projekts.

In dieser Markup Datei kann man Texte verfassen.

## Installation

### Backend
Für das Backend müssen die Dependencies durch ein Virtual Environment installiert werden.
Diese sind in der Datei "requirements.txt" gespeichert.

```bash
cd Backend
python -m venv .venv
.venv/Scripts/Activate.ps1
pip install -r requirements.txt
```

### Frontend

Für das Frontend müssen die Dependencies mit npm installiert werden. Stelle sicher, dass Node.js und npm auf deinem System installiert sind.

Download: https://nodejs.org/en

Installiere anschließend die Dependencies mit dem npm (Node Package Manager).
```bash
cd Frontend
npm install
```

## Testen

Das startet lokal den Server für das Backend.

```bash
cd Backend
flask --app app run
```

Und das Frontend:

```bash
cd Frontend
npm run dev
```