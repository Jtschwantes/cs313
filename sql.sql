CREATE TABLE post (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    -- points INT NOT NULL,
    body VARCHAR(4000) NOT NULL
    -- userId INT NOT NULL REFERENCES user(id)
);

CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    -- points INT NOT NULL,
    body VARCHAR(4000) NOT NULL
    -- userId INT NOT NULL REFERENCES user(id)
);

-- CREATE TABLE user (
--     id SERIAL PRIMARY KEY NOT NULL,
--     username VARCHAR(60) NOT NULL,
--     password VARCHAR(60) NOT NULL,
--     points INT NOT NULL,
--     posts INT[] REFERENCES post(id),
-- );