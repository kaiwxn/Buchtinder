# Buchtinder
Bücher? Tinder?
Lesen ist nicht immer etwas Individuelles. Lerne Freunde mit ähnlichen Buchvorlieben kennen - und das im altbekannten Swipe-Format!

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

Öffne für das Frontend ein separates Terminal und führe die folgenden Befehle aus:

```bash
cd Frontend
npm run dev
```

## Credits
Informatik 12/2
