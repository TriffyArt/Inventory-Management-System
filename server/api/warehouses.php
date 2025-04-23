<?php
// CORS & Content Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// DB connection
$mysqli = new mysqli("localhost", "root", "", "inventory_db");

// Error check
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $mysqli->connect_error]);
    exit;
}

// Route Handling
switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        $res = $mysqli->query("SELECT * FROM warehouses");
        $data = [];
        while ($row = $res->fetch_assoc()) $data[] = $row;
        echo json_encode($data);
        break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!isset($input['name'])) {
                echo json_encode(["error" => "Missing 'name' field"]);
                exit;
            }
        
            if (isset($input['id'])) {
                // ✅ Update existing warehouse
                $stmt = $mysqli->prepare("UPDATE warehouses SET name = ? WHERE id = ?");
                $stmt->bind_param("si", $input['name'], $input['id']);
                $stmt->execute();
                echo json_encode(["status" => "updated"]);
            } else {
                // ✅ Insert new warehouse
                $stmt = $mysqli->prepare("INSERT INTO warehouses (name) VALUES (?)");
                $stmt->bind_param("s", $input['name']);
                $stmt->execute();
                echo json_encode(["status" => "created"]);
            }
            break;
        

    case 'DELETE':
        $id = basename($_SERVER['REQUEST_URI']);
        if (!is_numeric($id)) {
            echo json_encode(["error" => "Invalid warehouse ID"]);
            exit;
        }
        $stmt = $mysqli->prepare("DELETE FROM warehouses WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["status" => "deleted"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}
?>
