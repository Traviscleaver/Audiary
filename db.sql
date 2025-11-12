-- =========================================
-- USERS
-- =========================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    joined_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- ARTISTS (cached metadata from MusicBrainz)
-- =========================================
CREATE TABLE artists (
    artist_id SERIAL PRIMARY KEY,
    mbid UUID UNIQUE NOT NULL,
    name VARCHAR(255),
    image_url TEXT,
    last_fetched TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- ALBUMS
-- =========================================
CREATE TABLE albums (
    album_id SERIAL PRIMARY KEY,
    mbid UUID UNIQUE NOT NULL,
    artist_id INT REFERENCES artists(artist_id) ON DELETE CASCADE,
    title VARCHAR(255),
    release_year INT,
    cover_url TEXT,
    last_fetched TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- SONGS
-- =========================================
CREATE TABLE songs (
    song_id SERIAL PRIMARY KEY,
    mbid UUID UNIQUE NOT NULL,
    album_id INT REFERENCES albums(album_id) ON DELETE CASCADE,
    title VARCHAR(255),
    duration INT, -- seconds
    track_number INT,
    spotify_url TEXT,
    last_fetched TIMESTAMP DEFAULT NOW()
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

-- =========================================
-- RATINGS (for ratings without text reviews)
-- =========================================
CREATE TABLE ratings (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,
    rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 10),
    rated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, song_id)
);

-- =========================================
-- DIARY ENTRIES (chronological listening log)
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

-- =========================================
-- FAVORITES
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
-- ACTIVITY FEED (recent user actions)
-- =========================================
CREATE TYPE activity_type AS ENUM ('rating', 'review', 'playlist_add', 'favorite', 'diary_entry');

CREATE TABLE activities (
    activity_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    type activity_type NOT NULL,
    target_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

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

-- Run this *after* your existing schema

-- Store password hashes separately
CREATE TABLE IF NOT EXISTS auth_local (
  user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL
);

-- Useful indices/constraints
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx ON users (LOWER(username));

-- Optional (future-proof for OAuth like Google/Apple)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS oauth_provider TEXT,
  ADD COLUMN IF NOT EXISTS oauth_sub TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS users_oauth_unique
  ON users (oauth_provider, oauth_sub)
  WHERE oauth_provider IS NOT NULL AND oauth_sub IS NOT NULL;

