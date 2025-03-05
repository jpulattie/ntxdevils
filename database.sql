CREATE DATABASE IF NOT EXISTS team_database;

USE team_database;

CREATE TABLE IF NOT EXISTS program(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    program_name VARCHAR(225)
);

CREATE TABLE IF NOT EXISTS team(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    team_name VARCHAR(225) NOT NULL,
    program_id INT NOT NULL,
    FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS info(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    program_id INT NOT NULL,
    info_title VARCHAR(225),
    info_description TEXT,
    info_link TEXT,
    FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS announcements(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    program_id INT NOT NULL,
    announcement_title VARCHAR(225),
    announcement TEXT,
    FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS roster(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    team_id INT NOT NULL,
    player_name VARCHAR(225),
    position VARCHAR(225),
    grade VARCHAR(225),
    year_playing INT,
    bio TEXT,
    picture_url TEXT,
    FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE CASCADE
);

-- intersection table between TEAM and EVENTS 
CREATE TABLE IF NOT EXISTS schedule(
    team_id INT NOT NULL,
    event_id INT NOT NULL,
    PRIMARY KEY (team_id, event_id),
    FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS event(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    event_name VARCHAR(225),
    event_type VARCHAR(225),
    event_date DATE,
    event_time TIME,
    event_description VARCHAR(225),
    event_address TEXT,
    event_city VARCHAR(225),
    event_state VARCHAR(225),
    event_zip VARCHAR(225),
    opponent VARCHAR(225),
    team_score INT,
    opponent_score INT,
    result VARCHAR(225)
);

CREATE TABLE IF NOT EXISTS sponsor(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    program_id INT NOT NULL,
    sponsor_name VARCHAR(225),
    sponsor_level VARCHAR(225),
    sponsor_address VARCHAR(225),
    sponsor_website VARCHAR(225),
    sponsor_phone VARCHAR(225),
    sponsor_bio TEXT,
    sponsor_photo VARCHAR(225),
    FOREIGN KEY (program_id) REFERENCES program(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS photo_intersection(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    photo_id INT NOT NULL,
    team_id INT,
    roster_id INT,
    event_id INT,
    FOREIGN KEY (photo_id) REFERENCES photo(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE CASCADE,
    FOREIGN KEY (roster_id) REFERENCES roster(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS photo(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    photo_url TEXT NOT NULL

);