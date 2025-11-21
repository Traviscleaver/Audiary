-- -- =========================================
-- -- USERS
-- -- =========================================

-- CREATE TABLE users (
--     user_id SERIAL PRIMARY KEY,
--     email VARCHAR(100) UNIQUE NOT NULL,
--     username VARCHAR(50) UNIQUE NOT NULL,
--     display_name VARCHAR(100),
--     avatar_url TEXT,
--     joined_at TIMESTAMP DEFAULT NOW()
-- );

-- -- =========================================
-- -- ARTISTS (cached metadata from MusicBrainz)
-- -- =========================================
-- CREATE TABLE artists (
--     artist_id SERIAL PRIMARY KEY,
--     mbid UUID UNIQUE NOT NULL,
--     name VARCHAR(255),
--     image_url TEXT,
--     last_fetched TIMESTAMP DEFAULT NOW()
-- );

-- -- =========================================
-- -- ALBUMS
-- -- =========================================
-- CREATE TABLE albums (
--     album_id SERIAL PRIMARY KEY,
--     mbid UUID UNIQUE NOT NULL,
--     artist_id INT REFERENCES artists(artist_id) ON DELETE CASCADE,
--     title VARCHAR(255),
--     release_year INT,
--     cover_url TEXT,
--     last_fetched TIMESTAMP DEFAULT NOW()
-- );

-- -- =========================================
-- -- SONGS
-- -- =========================================
-- CREATE TABLE songs (
--     song_id SERIAL PRIMARY KEY,
--     mbid UUID UNIQUE NOT NULL,
--     album_id INT REFERENCES albums(album_id) ON DELETE CASCADE,
--     title VARCHAR(255),
--     duration INT, -- seconds
--     track_number INT,
--     spotify_url TEXT,
--     last_fetched TIMESTAMP DEFAULT NOW()
-- );

-- -- =========================================
-- -- PLAYLISTS
-- -- =========================================
-- CREATE TABLE playlists (
--     playlist_id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     is_public BOOLEAN DEFAULT TRUE,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE playlist_songs (
--     playlist_id INT REFERENCES playlists(playlist_id) ON DELETE CASCADE,
--     song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,
--     position INT,
--     PRIMARY KEY (playlist_id, song_id)
-- );

-- -- =========================================
-- -- REVIEWS
-- -- =========================================
-- CREATE TABLE reviews (
--     review_id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
--     song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,
--     rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 10),
--     content TEXT,
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW()
-- );

-- -- =========================================
-- -- RATINGS (for ratings without text reviews)
-- -- =========================================
-- CREATE TABLE ratings (
--     user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
--     song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,
--     rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 10),
--     rated_at TIMESTAMP DEFAULT NOW(),
--     PRIMARY KEY (user_id, song_id)
-- );

-- -- =========================================
-- -- DIARY ENTRIES (chronological listening log)
-- -- =========================================
-- CREATE TABLE diary_entries (
--     entry_id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
--     song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,
--     listened_at TIMESTAMP DEFAULT NOW(),
--     rating NUMERIC(2,1),
--     review_id INT REFERENCES reviews(review_id) ON DELETE SET NULL,
--     notes TEXT
-- );

-- -- =========================================
-- -- FAVORITES
-- -- =========================================
-- CREATE TYPE favorite_type AS ENUM ('song', 'album', 'artist');

-- CREATE TABLE favorites (
--     user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
--     item_type favorite_type NOT NULL,
--     item_id INT NOT NULL,
--     added_at TIMESTAMP DEFAULT NOW(),
--     PRIMARY KEY (user_id, item_type, item_id)
-- );

-- -- =========================================
-- -- ACTIVITY FEED (recent user actions)
-- -- =========================================
-- CREATE TYPE activity_type AS ENUM ('rating', 'review', 'playlist_add', 'favorite', 'diary_entry');

-- CREATE TABLE activities (
--     activity_id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
--     type activity_type NOT NULL,
--     target_id INT,
--     description TEXT,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- -- =========================================
-- -- USER STATS (cached aggregates)
-- -- =========================================
-- CREATE TABLE stats (
--     user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
--     total_reviews INT DEFAULT 0,
--     total_ratings INT DEFAULT 0,
--     avg_rating NUMERIC(3,2) DEFAULT 0,
--     total_songs_listened INT DEFAULT 0,
--     total_artists INT DEFAULT 0,
--     last_updated TIMESTAMP DEFAULT NOW()
-- );

-- -- Run this *after* your existing schema

-- -- Store password hashes separately
-- CREATE TABLE IF NOT EXISTS auth_local (
--   user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
--   password_hash TEXT NOT NULL
-- );

-- -- Useful indices/constraints
-- CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email));
-- CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx ON users (LOWER(username));

-- -- Optional (future-proof for OAuth like Google/Apple)
-- ALTER TABLE users
--   ADD COLUMN IF NOT EXISTS oauth_provider TEXT,
--   ADD COLUMN IF NOT EXISTS oauth_sub TEXT;

-- CREATE UNIQUE INDEX IF NOT EXISTS users_oauth_unique
--   ON users (oauth_provider, oauth_sub)
--   WHERE oauth_provider IS NOT NULL AND oauth_sub IS NOT NULL;

-- =========================================
-- USERS (core identity + auth metadata)
-- =========================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    joined_at TIMESTAMP DEFAULT NOW(),

    oauth_provider TEXT,
    oauth_sub TEXT
);

CREATE UNIQUE INDEX users_email_lower_idx ON users (LOWER(email));
CREATE UNIQUE INDEX users_username_lower_idx ON users (LOWER(username));

CREATE UNIQUE INDEX users_oauth_unique
    ON users (oauth_provider, oauth_sub)
    WHERE oauth_provider IS NOT NULL AND oauth_sub IS NOT NULL;


-- =========================================
-- AUTH (local email/password)
-- =========================================
CREATE TABLE auth_local (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL
);


-- =========================================
-- USER PROFILES (extended info)
-- =========================================
CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,

    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    location VARCHAR(150),
    website VARCHAR(255),
    banner_url TEXT,

    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX user_profiles_location_idx ON user_profiles (location);


-- =========================================
-- SOCIAL: FOLLOWS (followers / following)
-- =========================================
CREATE TABLE follows (
    follower_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    following_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    followed_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE INDEX follows_following_idx ON follows (following_id);


-- =========================================
-- SOCIAL: USER BLOCKING
-- =========================================
CREATE TABLE user_blocks (
    blocker_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    blocked_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    blocked_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (blocker_id, blocked_id)
);


-- =========================================
-- ARTISTS (Spotify + MusicBrainz)
-- =========================================
CREATE TABLE artists (
    artist_id SERIAL PRIMARY KEY,

    spotify_id TEXT UNIQUE,
    mbid UUID UNIQUE,

    name VARCHAR(255),
    image_url TEXT,

    followers INT,
    genres TEXT[],

    last_fetched TIMESTAMP DEFAULT NOW()
);


-- =========================================
-- ALBUMS (Spotify + MusicBrainz)
-- =========================================
CREATE TABLE albums (
    album_id SERIAL PRIMARY KEY,

    spotify_id TEXT UNIQUE,
    mbid UUID UNIQUE,

    artist_id INT REFERENCES artists(artist_id) ON DELETE CASCADE,

    title VARCHAR(255),
    release_year INT,
    cover_url TEXT,
    total_tracks INT,

    last_fetched TIMESTAMP DEFAULT NOW()
);


-- =========================================
-- SONGS (Spotify + MusicBrainz)
-- =========================================
CREATE TABLE songs (
    song_id SERIAL PRIMARY KEY,

    spotify_id TEXT UNIQUE,
    mbid UUID UNIQUE,

    album_id INT REFERENCES albums(album_id) ON DELETE CASCADE,

    title VARCHAR(255),
    duration INT,
    track_number INT,

    isrc VARCHAR(50),
    popularity INT,
    preview_url TEXT,
    spotify_url TEXT,

    last_fetched TIMESTAMP DEFAULT NOW()
);


-- =========================================
-- MULTIPLE ARTISTS PER SONG (collabs)
-- =========================================
CREATE TABLE song_artists (
    song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,
    artist_id INT REFERENCES artists(artist_id) ON DELETE CASCADE,
    PRIMARY KEY (song_id, artist_id)
);


-- =========================================
-- PLAYLISTS
-- =========================================
CREATE TABLE playlists (
    playlist_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE playlist_songs (
    playlist_id INT REFERENCES playlists(playlist_id) ON DELETE CASCADE,
    song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,
    position INT,
    PRIMARY KEY (playlist_id, song_id)
);


-- =========================================
-- REVIEWS
-- =========================================
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,

    rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 10),
    content TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX reviews_user_idx ON reviews (user_id, created_at DESC);


-- =========================================
-- REVIEW LIKES
-- =========================================
CREATE TABLE review_likes (
    review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    liked_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (review_id, user_id)
);


-- =========================================
-- COMMENTS (on reviews)
-- =========================================
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,

    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX comments_review_idx ON comments (review_id);


-- =========================================
-- RATINGS (rating without review)
-- =========================================
CREATE TABLE ratings (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,
    rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 10),
    rated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, song_id)
);


-- =========================================
-- DIARY ENTRIES (listening log)
-- =========================================
CREATE TABLE diary_entries (
    entry_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,

    listened_at TIMESTAMP DEFAULT NOW(),
    rating NUMERIC(2,1),

    review_id INT REFERENCES reviews(review_id) ON DELETE SET NULL,
    notes TEXT
);

CREATE INDEX diary_user_idx ON diary_entries (user_id, listened_at DESC);


-- =========================================
-- FAVORITES (song, album, artist)
-- =========================================
CREATE TYPE favorite_type AS ENUM ('song', 'album', 'artist');

CREATE TABLE favorites (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    item_type favorite_type NOT NULL,
    item_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, item_type, item_id)
);


-- =========================================
-- PINNED ITEMS (profile)
-- =========================================
CREATE TABLE user_pins (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    item_type favorite_type NOT NULL,
    item_id INT NOT NULL,
    pinned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, item_type, item_id)
);


-- =========================================
-- LISTEN LATER
-- =========================================
CREATE TABLE listen_later (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, song_id)
);


-- =========================================
-- NOTIFICATIONS
-- =========================================
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,

    type TEXT NOT NULL,
    payload JSONB,
    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW()
);


-- =========================================
-- ACTIVITY FEED
-- =========================================
CREATE TYPE activity_type AS ENUM (
    'rating',
    'review',
    'playlist_add',
    'favorite',
    'diary_entry',
    'follow'
);

CREATE TABLE activities (
    activity_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,

    type activity_type NOT NULL,
    target_id INT,
    description TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX activities_user_idx ON activities (user_id, created_at DESC);


-- =========================================
-- USER STATS (cached aggregates)
-- =========================================
CREATE TABLE stats (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,

    total_reviews INT DEFAULT 0,
    total_ratings INT DEFAULT 0,
    avg_rating NUMERIC(3,2) DEFAULT 0,
    total_songs_listened INT DEFAULT 0,
    total_artists INT DEFAULT 0,

    last_updated TIMESTAMP DEFAULT NOW()
);


-- =========================================
-- MESSAGING: THREADS (DMs & group chats)
-- =========================================
CREATE TABLE threads (
    thread_id SERIAL PRIMARY KEY,
    is_group BOOLEAN DEFAULT FALSE,
    name VARCHAR(255),

    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT NOW(),

    last_message_text TEXT,
    last_message_sender INT REFERENCES users(user_id),
    last_message_at TIMESTAMP
);


-- =========================================
-- MESSAGING: THREAD MEMBERS
-- =========================================
CREATE TABLE thread_members (
    thread_id INT REFERENCES threads(thread_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,

    joined_at TIMESTAMP DEFAULT NOW(),
    last_read_at TIMESTAMP,

    PRIMARY KEY (thread_id, user_id)
);


-- =========================================
-- MESSAGING: MESSAGES
-- =========================================
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    thread_id INT REFERENCES threads(thread_id) ON DELETE CASCADE,
    sender_id INT REFERENCES users(user_id) ON DELETE CASCADE,

    content TEXT,
    attachment_url TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX messages_thread_idx ON messages (thread_id, created_at DESC);


-- =========================================
-- MESSAGE REACTIONS
-- =========================================
CREATE TABLE message_reactions (
    message_id INT REFERENCES messages(message_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    reaction TEXT,
    reacted_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (message_id, user_id)
);
