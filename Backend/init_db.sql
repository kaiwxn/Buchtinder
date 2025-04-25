DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT(255),
    password TEXT(255),
    salt TEXT(32)
    
);