CREATE TABLE companies (
    handle TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    num_employees INTEGER,
    description TEXT,
    logo_url TEXT 
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary FLOAT,
    equity FLOAT CHECK(equity <= 1.0),
    company_handle TEXT NOT NULL REFERENCES companies ON DELETE CASCADE,
    date_posted TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    photo_url TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE applications (
    PRIMARY KEY(username, job_id),
    username TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES jobs ON DELETE CASCADE,
    state TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp
);