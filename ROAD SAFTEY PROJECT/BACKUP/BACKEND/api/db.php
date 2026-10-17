<?php
function getDbConnection()
{
    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $port = getenv('DB_PORT') ?: '3306';
    $username = getenv('DB_USER') ?: 'root';
    $password = getenv('DB_PASS') ?: '';

    $mysqli = new mysqli($host, $username, $password, '', (int) $port);

    if ($mysqli->connect_error) {
        throw new Exception('Database connection failed: ' . $mysqli->connect_error);
    }

    $dbNames = array_values(array_unique(array_filter([
        getenv('DB_NAME') ?: '',
        'road_safety',
        'ruhanix_road_safety'
    ], static fn($value) => $value !== '')));

    $dbname = '';
    foreach ($dbNames as $candidate) {
        if ($mysqli->select_db($candidate)) {
            $dbname = $candidate;
            break;
        }

        if ($mysqli->query("CREATE DATABASE IF NOT EXISTS `$candidate` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")) {
            if ($mysqli->select_db($candidate)) {
                $dbname = $candidate;
                break;
            }
        }
    }

    if ($dbname === '') {
        throw new Exception('Unable to initialize database: ' . $mysqli->error);
    }

    $mysqli->set_charset('utf8mb4');

    $mysqli->query("CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    return $mysqli;
}
