
import sqlite3

connection = sqlite3.connect('Backend/project.db')

with open('Backend/init_db.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO Users (name, email) VALUES ('ok', 'mail@gmail.com')",)

connection.commit()
connection.close()