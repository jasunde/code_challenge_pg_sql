-- Database name
sigma

-- Document your create tables SQL here
CREATE TABLE treats (
id SERIAL PRIMARY KEY,
name VARCHAR(80),
description TEXT,
pic VARCHAR(200)
);
