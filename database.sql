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
    year_playing VARCHAR(225),
    bio TEXT,
    picture TEXT,
    picture_key TEXT,
    sponsor_link TEXT,
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
    sponsor_photo_key VARCHAR(225),
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

-- person who donates to sponsor a specific player (not an organizational sponsor, see sponsor table above)
CREATE TABLE IF NOT EXISTS player_sponsors(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    sponsor_name VARCHAR(225),
    sponsor_email VARCHAR(225)
);

-- intersection table between ROSTER and PLAYER_SPONSORS
CREATE TABLE IF NOT EXISTS player_sponsorships(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    roster_id INT NOT NULL,
    player_sponsor_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(225) NOT NULL DEFAULT 'stripe',
    status VARCHAR(225) NOT NULL DEFAULT 'pending',
    stripe_checkout_session_id VARCHAR(225),
    stripe_payment_intent_id VARCHAR(225),
    payer_identifier VARCHAR(225),
    -- Single lifecycle field for the admin Sponsorships tab: null (unknown/never started),
    -- 'user_started' (sponsor opened the pay app), 'user_confirmed' (sponsor clicked "I've Sent
    -- the Payment"), 'club_confirmed' / 'club_rejected' (admin's final disposition). `status` above
    -- is unrelated -- it remains what the Stripe webhook path reads/writes.
    sponsorship_status VARCHAR(225),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (roster_id) REFERENCES roster(id) ON DELETE CASCADE,
    FOREIGN KEY (player_sponsor_id) REFERENCES player_sponsors(id) ON DELETE CASCADE
);

-- one dues record per player (roster_id is UNIQUE, not just indexed) -- admin-managed via the Dues
-- tab in /adminPortal, not self-reported like sponsorships. dues_paid/dues_partial are mutually
-- intended (not enforced at the DB level) as "paid in full" vs "paid something, not full" vs
-- neither set = unpaid; dues_amount_paid holds whatever dollar amount has actually come in so far.
CREATE TABLE IF NOT EXISTS dues(
    id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    roster_id INT NOT NULL UNIQUE,
    dues_paid BOOLEAN NOT NULL DEFAULT FALSE,
    dues_partial BOOLEAN NOT NULL DEFAULT FALSE,
    dues_amount_paid DECIMAL(10,2),
    FOREIGN KEY (roster_id) REFERENCES roster(id) ON DELETE CASCADE
);