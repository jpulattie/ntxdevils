create table if not exists new_text (
    id INT AUTO_INCREMENT primary key,
    curr_status VARCHAR(225),
    generate VARCHAR(225), 
    login_time INT,
    loggedIn VARCHAR(225),

    new_announcement_title VARCHAR(225),
    new_announcement TEXT,

    new_player_name VARCHAR(225),
    new_position VARCHAR(225),
    new_year_playing INT,
    new_bio TEXT,
    new_picture TEXT,
    new_picture_key TEXT,

    new_info_title VARCHAR(225),
    new_info_description TEXT,
    new_info_link TEXT,

    new_sponsor_name VARCHAR(225),
    new_sponsor_level VARCHAR(225),
    new_sponsor_address VARCHAR(225),
    new_sponsor_website VARCHAR(225),
    new_sponsor_phone VARCHAR(225),
    new_sponsor_bio TEXT,
    new_sponsor_photo VARCHAR(225),

    new_event_name VARCHAR(225),
    new_event_type VARCHAR(225),
    new_event_date DATE,
    new_event_time TIME,
    new_event_description VARCHAR(225),
    new_event_address TEXT,
    new_opponent VARCHAR(225),
    new_team_score INT,
    new_opponent_score INT,
    new_result VARCHAR(225)
)
