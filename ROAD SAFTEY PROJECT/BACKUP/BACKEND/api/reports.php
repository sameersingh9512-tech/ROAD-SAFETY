<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$reportType = $data['type'] ?? 'general';
$description = $data['description'] ?? 'No details provided';

echo json_encode([
    'status' => 'success',
    'message' => 'Report submitted successfully',
    'type' => $reportType,
    'description' => $description
]);
