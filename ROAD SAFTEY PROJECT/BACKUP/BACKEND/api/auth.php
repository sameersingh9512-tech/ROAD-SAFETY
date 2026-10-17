<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db.php';

try {
    $mysqli = getDbConnection();
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$action = isset($data['action']) ? strtolower($data['action']) : 'login';
if ($action === 'signin') {
    $action = 'login';
}
$name = trim($data['name'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';
$roleValue = $data['role'] ?? 'user';
$role = in_array($roleValue, ['user', 'authority'], true) ? $roleValue : 'user';

if ($action === 'signup') {
    if ($name === '' || $email === '' || strlen($password) < 6) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Please provide a name, a valid email, and a password with at least 6 characters.'
        ]);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $mysqli->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'An account with this email already exists.'
        ]);
        $stmt->close();
        $mysqli->close();
        exit;
    }
    $stmt->close();

    $insertStmt = $mysqli->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    $insertStmt->bind_param('ssss', $name, $email, $passwordHash, $role);

    if (!$insertStmt->execute()) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Unable to create account: ' . $insertStmt->error
        ]);
        $insertStmt->close();
        $mysqli->close();
        exit;
    }

    $insertStmt->close();
    $mysqli->close();

    echo json_encode([
        'status' => 'success',
        'message' => 'Account created successfully',
        'role' => $role,
        'email' => $email
    ]);
    exit;
}

if ($email === '' || strlen($password) < 1) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Please provide an email and password.'
    ]);
    exit;
}

$stmt = $mysqli->prepare('SELECT id, name, password, role FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();
$mysqli->close();

if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid email or password.'
    ]);
    exit;
}

echo json_encode([
    'status' => 'success',
    'message' => 'Login successful',
    'role' => $user['role'],
    'name' => $user['name'],
    'email' => $email
]);
