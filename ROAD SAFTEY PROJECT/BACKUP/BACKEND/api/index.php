<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$response = [
    'status' => 'success',
    'message' => 'Ruhanix Road Safety API is running',
    'features' => [
        'traffic_videos',
        'emergency_alerts',
        'sharp_turn_alerts',
        'traffic_rules',
        'quick_reports'
    ]
];

echo json_encode($response);
