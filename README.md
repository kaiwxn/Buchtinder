# Unser Projekt

Das hier ist die Beschreibung unseres Projekts.

In dieser Markup Datei kann man Texte verfassen.

## Installation

Für das Backend müssen die Dependencies durch ein Virtual Environment installiert werden.
Diese sind in der Datei "requirements.txt" gespeichert.

```bash
cd Backend
python -m venv .venv
.venv/Scripts/Activate.ps1
pip install -r requirements.txt
```



## Testing

Das startet lokal einen Server für das Backend.

```bash
cd Frontend/buchapp-vite
flask --app main run --debug
```

