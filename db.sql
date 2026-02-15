BEGIN;

-- ===== ENUMS (edit values to match your app) =====
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
    CREATE TYPE activity_type AS ENUM (
      'follow','like','comment','review','rating','favorite','message','playlist','diary'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_type') THEN
    CREATE TYPE item_type AS ENUM ('Tracks','Albums','Artists');
  END IF;
END $$;

-- ===== users =====
CREATE TABLE IF NOT EXISTS users (
  user_id        integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email          varchar,
  username       varchar,
  display_name   varchar,
  avatar_url     text,
  joined_at      timestamp without time zone DEFAULT now(),
  oauth_provider text,
  oauth_sub      text
);

-- ===== user_profiles =====
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id      integer PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  first_name   varchar,
  last_name    varchar,
  bio          text,
  location     varchar,
  website      varchar,
  banner_url   text,
  last_updated timestamp without time zone DEFAULT now()
);

-- ===== auth_local =====
CREATE TABLE IF NOT EXISTS auth_local (
  user_id        integer PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  password_hash  text NOT NULL
);

-- ===== artists =====
CREATE TABLE IF NOT EXISTS artists (
  artist_id    integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  spotify_id   text,
  mbid         uuid,
  name         varchar,
  image_url    text,
  followers    integer,
  genres       text[],
  last_fetched timestamp without time zone
);

-- ===== albums =====
CREATE TABLE IF NOT EXISTS albums (
  album_id      integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  spotify_id    text,
  mbid          uuid,
  artist_id     integer REFERENCES artists(artist_id) ON DELETE SET NULL,
  title         varchar,
  release_year  integer,
  cover_url     text,
  total_tracks  integer,
  last_fetched  timestamp without time zone
);

-- ===== songs =====
CREATE TABLE IF NOT EXISTS songs (
  song_id      integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  spotify_id   text,
  mbid         uuid,
  album_id     integer REFERENCES albums(album_id) ON DELETE SET NULL,
  title        varchar,
  duration     integer,
  track_number integer,
  isrc         varchar,
  popularity   integer,
  preview_url  text,
  spotify_url  text,
  last_fetched timestamp without time zone
);

-- ===== song_artists (join) =====
CREATE TABLE IF NOT EXISTS song_artists (
  song_id   integer NOT NULL REFERENCES songs(song_id) ON DELETE CASCADE,
  artist_id integer NOT NULL REFERENCES artists(artist_id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, artist_id)
);

-- ===== reviews =====
CREATE TABLE IF NOT EXISTS reviews (
  review_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    integer REFERENCES users(user_id) ON DELETE CASCADE,
  song_id    integer REFERENCES songs(song_id) ON DELETE SET NULL,
  rating     numeric,
  content    text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  album_id   integer REFERENCES albums(album_id) ON DELETE SET NULL
);

-- ===== comments =====
CREATE TABLE IF NOT EXISTS comments (
  comment_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  review_id  integer REFERENCES reviews(review_id) ON DELETE CASCADE,
  user_id    integer REFERENCES users(user_id) ON DELETE CASCADE,
  content    text,
  created_at timestamp without time zone DEFAULT now()
);

-- ===== review_likes (join) =====
CREATE TABLE IF NOT EXISTS review_likes (
  review_id integer NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE,
  user_id   integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  liked_at  timestamp without time zone DEFAULT now(),
  PRIMARY KEY (review_id, user_id)
);

-- ===== diary_entries =====
CREATE TABLE IF NOT EXISTS diary_entries (
  entry_id     integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      integer REFERENCES users(user_id) ON DELETE CASCADE,
  song_id      integer REFERENCES songs(song_id) ON DELETE SET NULL,
  listened_at  timestamp without time zone DEFAULT now(),
  rating       numeric,
  review_id    integer REFERENCES reviews(review_id) ON DELETE SET NULL,
  notes        text
);

-- ===== favorites (join-ish) =====
CREATE TABLE IF NOT EXISTS favorites (
  user_id    integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  item_type  item_type NOT NULL,
  item_id    integer NOT NULL,
  added_at   timestamp without time zone DEFAULT now(),
  PRIMARY KEY (user_id, item_type, item_id)
);

-- ===== listen_later =====
CREATE TABLE IF NOT EXISTS listen_later (
  user_id   integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  song_id   integer NOT NULL REFERENCES songs(song_id) ON DELETE CASCADE,
  added_at  timestamp without time zone DEFAULT now(),
  PRIMARY KEY (user_id, song_id)
);

-- ===== follows =====
CREATE TABLE IF NOT EXISTS follows (
  follower_id  integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  following_id integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  followed_at  timestamp without time zone DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

-- ===== user_blocks =====
CREATE TABLE IF NOT EXISTS user_blocks (
  blocker_id integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  blocked_id integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  blocked_at timestamp without time zone DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- ===== playlists =====
CREATE TABLE IF NOT EXISTS playlists (
  playlist_id  integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      integer REFERENCES users(user_id) ON DELETE CASCADE,
  title        varchar,
  description  text,
  is_public    boolean DEFAULT false,
  created_at   timestamp without time zone DEFAULT now()
);

-- ===== playlist_songs =====
CREATE TABLE IF NOT EXISTS playlist_songs (
  playlist_id integer NOT NULL REFERENCES playlists(playlist_id) ON DELETE CASCADE,
  song_id     integer NOT NULL REFERENCES songs(song_id) ON DELETE CASCADE,
  position    integer,
  PRIMARY KEY (playlist_id, song_id)
);

-- ===== threads =====
CREATE TABLE IF NOT EXISTS threads (
  thread_id           integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  is_group            boolean DEFAULT false,
  name                varchar,
  created_by          integer REFERENCES users(user_id) ON DELETE SET NULL,
  created_at          timestamp without time zone DEFAULT now(),
  last_message_text   text,
  last_message_sender integer REFERENCES users(user_id) ON DELETE SET NULL,
  last_message_at     timestamp without time zone
);

-- ===== thread_members =====
CREATE TABLE IF NOT EXISTS thread_members (
  thread_id    integer NOT NULL REFERENCES threads(thread_id) ON DELETE CASCADE,
  user_id      integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  joined_at    timestamp without time zone DEFAULT now(),
  last_read_at timestamp without time zone,
  PRIMARY KEY (thread_id, user_id)
);

-- ===== messages =====
CREATE TABLE IF NOT EXISTS messages (
  message_id     integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  thread_id      integer REFERENCES threads(thread_id) ON DELETE CASCADE,
  sender_id      integer REFERENCES users(user_id) ON DELETE SET NULL,
  content        text,
  attachment_url text,
  created_at     timestamp without time zone DEFAULT now()
);

-- ===== message_reactions =====
CREATE TABLE IF NOT EXISTS message_reactions (
  message_id integer NOT NULL REFERENCES messages(message_id) ON DELETE CASCADE,
  user_id    integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  reaction   text NOT NULL,
  reacted_at timestamp without time zone DEFAULT now(),
  PRIMARY KEY (message_id, user_id, reaction)
);

-- ===== notifications =====
CREATE TABLE IF NOT EXISTS notifications (
  notification_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id         integer REFERENCES users(user_id) ON DELETE CASCADE,
  type            text,
  payload         jsonb,
  is_read         boolean DEFAULT false,
  created_at      timestamp without time zone DEFAULT now()
);

-- ===== activities =====
CREATE TABLE IF NOT EXISTS activities (
  activity_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     integer REFERENCES users(user_id) ON DELETE CASCADE,
  type        activity_type,
  target_id   integer,
  description text,
  created_at  timestamp without time zone DEFAULT now()
);

-- ===== user_pins =====
CREATE TABLE IF NOT EXISTS user_pins (
  user_id    integer NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  item_type  item_type NOT NULL,
  item_id    integer NOT NULL,
  pinned_at  timestamp without time zone DEFAULT now(),
  PRIMARY KEY (user_id, item_type, item_id)
);

COMMIT;
