<?php
$to = "kontakt.oxgaming@gmail.com";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Ungültiger Aufruf.");
}

$name    = trim($_POST["name"] ?? "");
$email   = trim($_POST["email"] ?? "");
$title   = trim($_POST["title"] ?? "");
$message = trim($_POST["message"] ?? "");

if ($name === "" || $email === "" || $title === "") {
    die("Bitte alle Pflichtfelder ausfüllen.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Ungültige E-Mail-Adresse.");
}

if (!isset($_FILES["image"]) || $_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
    die("Fehler beim Datei-Upload.");
}

$fileTmp  = $_FILES["image"]["tmp_name"];
$fileName = $_FILES["image"]["name"];
$fileSize = $_FILES["image"]["size"];
$fileType = mime_content_type($fileTmp);

$allowedTypes = ["image/jpeg", "image/png"];

if (!in_array($fileType, $allowedTypes)) {
    die("Nur JPG, JPEG oder PNG erlaubt.");
}

if ($fileSize > 5 * 1024 * 1024) {
    die("Datei ist zu groß (max. 5MB).");
}

$bodyText = "Neue Einsendung:\n\n";
$bodyText .= "Name: $name\n";
$bodyText .= "E-Mail: $email\n";
$bodyText .= "Titel: $title\n\n";
$bodyText .= "Beschreibung:\n$message\n";

$boundary = md5(time());

$headers  = "From: Upload Formular <no-reply@deinedomain.de>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"";

$body  = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
$body .= $bodyText . "\r\n";

$fileContent = chunk_split(base64_encode(file_get_contents($fileTmp)));

$body .= "--$boundary\r\n";
$body .= "Content-Type: $fileType; name=\"$fileName\"\r\n";
$body .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n\r\n";
$body .= $fileContent . "\r\n";
$body .= "--$boundary--";

$subject = "Neue Upload-Einsendung: $title";

if (mail($to, $subject, $body, $headers)) {
    echo "Erfolgreich gesendet. Danke!";
} else {
    echo "Fehler beim Senden der E-Mail.";
}
?>
