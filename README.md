# SMART_CLIENT_RESPONSE - README

## Overview

This project provides an email system that allows users to send project inquiries and automatically receive a professional response. The system handles two main functionalities:

1. **Sending Project Inquiry Emails**: It sends an email containing the details of a new project inquiry to a specified email address.
2. **Sending Auto-Reply Emails**: After the inquiry is sent, the system generates an auto-reply email to acknowledge the inquiry, using OpenAI’s GPT model to craft a personalized response.

The backend is built using **Node.js**, and the system uses several libraries like **Nodemailer** for email sending and **OpenAI** for generating auto-replies.

---

## Features

1. **Project Inquiry Form**: The form collects information about the project, such as the project type, service category, and client details.
2. **Email Notifications**: The system sends two emails:
   - A **notification email** to a predefined email address with the details of the inquiry.
   - An **auto-reply** to the client acknowledging their inquiry.
3. **Automatic Professional Response**: The auto-reply message is generated using OpenAI’s GPT-3 model, providing a personalized and professional response to the client.

---

## Requirements

Before setting up this project, ensure you have the following:

1. **Node.js**: Make sure you have **Node.js** installed on your machine. You can download it from [here](https://nodejs.org/).
2. **Nodemailer**: Used for sending emails from the backend.
3. **OpenAI API Key**: The project uses OpenAI’s GPT-3 model to generate auto-reply messages. You need an API key from OpenAI.
4. **Gmail Account**: The email service uses Gmail's SMTP server to send emails, so you’ll need to have a Gmail account for this to work.

---

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone git@github.com:yashaswinidoddmane/D_M_YASHASWINI-4KV21CS119-_SMART_CLIENT_RESPONSE_KVG_COLLEGE_OF_ENGINEERING_SULLIA_D_K.git
cd project-inquiry-system
```

### 2. Install Dependencies

Once you’ve cloned the repository, install the required dependencies:

```bash
npm install
```

### 3. Create a .env File (for this project i have pushed .env file too)

You will need to create a .env file in the root directory of the project and provide your environment variables. The .env file should contain the following keys:

```bash
OPENAI_API_KEY=your_openai_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

```

1. **OPENAI_API_KEY**: Get this API key from OpenAI by creating an account and generating an API key at OpenAI.
2. **EMAIL_USER**: This is your Gmail address used to send emails.
3. **EMAIL_PASS**: This is the password for your Gmail account.

---

# Running the Project

## 1. Start the Server

To run the project locally, use the following command:

```bash
npm start
```

# Steps to Test the API in Postman

## 1. Open Postman

- Launch the Postman application on your desktop or use the Postman web version.

## 2. Set Up the Request

### a. Method:

- Set the request method to **POST** by selecting `POST` from the dropdown list next to the URL field.

### b. URL:

- Enter the URL of your local server. If you're running the project locally, the URL will typically be something like:

```bash
http://localhost:5005/send-email
```

## 4. Set the Request Body

1. In Postman, navigate to the **Body** tab below the URL field.
2. Select **raw** from the available options for data format.
3. In the dropdown next to the **raw** option, set the format to `JSON` by selecting **JSON (application/json)**.
4. Paste the following JSON structure into the body:

```json
{
  "fromName": "Jesna",
  "clientFirstName": "Geminas",
  "clientLastName": "Ket",
  "clientEmail": "client@gmail.com",
  "clientCountry": "Romania",
  "clientLocation": "Romania",
  "clientLanguage": "English",
  "projectType": "Content with Databases",
  "serviceCategory": "Web Development",
  "clientWebsite": "No",
  "additionalInformation": "I need 4 dynamic pages for a real estate Web-application: one each for apartments, houses, business centres, and land. I need 2 filters for 'for sale' and 'for rent,' and they should be connected. Don't bother with the design; I'll handle that. I just need the functionality. The budget should be $100000. Thank you!"
}
```

## 5. Send the Request

1. After setting up the request body and all necessary parameters, click the **Send** button in Postman to make the POST request to the server.

   - Postman will send the request to the provided URL with the body and headers you've configured.

## 6. Check the Response

Once you click **Send**, Postman will display the response from the server in the lower section of the window. The response will include details such as the status code, response time, and response body.

### Expected Response:

If the email was sent successfully and the auto-reply was generated, you should receive a response similar to the following:

- **Status Code**: 200 OK (or another success status like 201 Created)
- **Response Body** (example):

```bash
{
    "message": "Email sent successfully and auto-reply generated"
}
```

# API Endpoints

## 1. `/` - Welcome Endpoint

This endpoint is used to confirm that the server is running.

### Example Request:

```bash
GET http://localhost:5005/
```

## Response

```bash
{
  "message": "Welcome folks"
}
```

### 2. POST `/send-email`

Used for sending a project inquiry email. You need to pass the required parameters in the request body.

#### Request Body Example:

```json
{
  "fromName": "John Doe",
  "clientFirstName": "Jane",
  "clientLastName": "Smith",
  "clientEmail": "jane.smith@example.com",
  "clientCountry": "USA",
  "clientLocation": "New York",
  "clientLanguage": "English",
  "projectType": "Web Development",
  "serviceCategory": "Frontend Development",
  "clientWebsite": "www.janeswebsite.com",
  "additionalInformation": "Looking for a website redesign."
}
```

## Response:

The response will indicate if the email was sent successfully and if the auto-reply was generated.
