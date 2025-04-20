<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $contact = trim($_POST["contact"]);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    if (!$name || !$message || empty($contact)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Name, message, and contact information are required.']);
        exit;
    }

    // Determine if the contact input is an email or phone
    if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
        // Send Email
        $to = "adeshinaolayodemubaraq@gmail.com";
        $subject = "New Contact Form Submission from $name";
        $email_content = "Name: $name\n";
        $email_content .= "Email: $contact\n\n";
        $email_content .= "Message:\n$message";

        $headers = "From: $contact\r\n";
        $headers .= "Reply-To: $contact\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        if (mail($to, $subject, $email_content, $headers)) {
            echo json_encode(['status' => 'success', 'message' => 'Thank you for your message. We will get back to you soon!']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Could not send message. Please try again later.']);
        }
    } else {
        // Assume it's a phone number and send WhatsApp message
        $whatsappNumber = "2349036176161";
        $encodedMessage = urlencode("Hello, my name is $name. Here's my message:\n$message\nPhone: $contact");

        echo json_encode([
            'status' => 'whatsapp',
            'message' => 'Redirecting to WhatsApp...',
            'redirect' => "https://wa.me/$whatsappNumber?text=$encodedMessage"
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}