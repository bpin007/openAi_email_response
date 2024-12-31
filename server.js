require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // Import Express framework for building the server
const nodemailer = require("nodemailer"); // Import Nodemailer to send emails
const cors = require("cors"); // Import CORS for cross-origin requests
const { OpenAI } = require("openai"); // Import OpenAI API to generate auto-replies

const PORT = 5005; // Set the server port to 5005
const app = express(); // Create an instance of the Express app

app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(cors("*")); // Middleware to allow cross-origin requests from all domains

// Initialize OpenAI API with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, //sir, OpenAI API is not any more free. So i kept fall back message
});

// Function to send email with project inquiry details
const sendEmail = async (options) => {
  console.log("Sending email with options:", options);

  const transporter = nodemailer.createTransport({
    // Configure Nodemailer transport
    host: "smtp.gmail.com", // Gmail SMTP server
    port: 465, // Port for secure connection
    secure: true, // Use secure connection
    auth: {
      user: process.env.EMAIL_USER, // Email address from environment variables
      pass: process.env.EMAIL_PASS, // Email password from environment variables
    },
  });

  // Prepare email content
  const mailOptions = {
    from: `${options.fromName} <${options.clientEmail}>`, // Sender email
    to: process.env.EMAIL_USER, // Recipient email (configured in environment variable)
    subject: `New Project Inquiry: ${options.projectType}`,
    text: `New Project Inquiry:\n\nName: ${options.fromName}\nEmail: ${options.clientEmail}\nCountry: ${options.clientCountry}\nLocation: ${options.clientLocation}\nLanguage: ${options.clientLanguage}\nProject Type: ${options.projectType}\nService Category: ${options.serviceCategory}\nClient Website: ${options.clientWebsite}\nAdditional Information:\n${options.additionalInformation}`, // Plain text version of the email body
    html: `
      <html>
        <body>
          <h2>New Project Inquiry</h2>
          <p><strong>Name:</strong> ${options.fromName}</p>
          <p><strong>Email:</strong> ${options.clientEmail}</p>
          <p><strong>Country:</strong> ${options.clientCountry}</p>
          <p><strong>Location:</strong> ${options.clientLocation}</p>
          <p><strong>Language:</strong> ${options.clientLanguage}</p>
          <p><strong>Project Type:</strong> ${options.projectType}</p>
          <p><strong>Service Category:</strong> ${options.serviceCategory}</p>
          <p><strong>Client Website:</strong> ${options.clientWebsite}</p>
          <p><strong>Additional Information:</strong></p>
          <p>${options.additionalInformation}</p>
        </body>
      </html>
    `,
  };

  // Send email a
  await transporter.sendMail(mailOptions);
  console.log("Sent email with options:", mailOptions);
};

// Function to generate an auto-reply message using OpenAI
const generateAutoReply = async (
  additionalInformation,
  projectType,
  serviceCategory
) => {
  try {
    // Send a request to OpenAI to generate an auto-reply
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant helping a user craft a friendly, warm, and professional auto-reply email. The tone should be polite, human, and engaging, with a personal touch.",
        },
        {
          role: "user",
          content: `Please write a warm, professional, and appreciative auto-reply message that acknowledges the following details of a project inquiry: ${additionalInformation}, ${projectType}, and ${serviceCategory}. The response should assure the sender that their inquiry is being processed, without including a subject line, closing signature, or the sender's name, position, or contact information. Avoid using the phrase 'Thank you for reaching out and sharing the details of your project inquiry.' Instead, directly address the specifics of the project in a friendly and clear manner`,
        },
      ],
    });

    // Return the generated auto-reply message
    return completion.choices[0].message.content;
  } catch (error) {
    // Handle errors from OpenAI API and return a default message
    console.log("Error generating auto-reply:", error);
    return `Oops! Something went wrong, and we couldn’t generate a reply at this moment. Unfortunately, OpenAI's API is no longer free 😭, and we are experiencing some issues. But don't worry, our team has received your inquiry and will be in touch with you soon. Thanks for your patience!`;
  }
};

// POST endpoint to handle the project inquiry email sending
app.post("/send-email", async (req, res) => {
  console.log("Received request to send email");
  // console.log("")
  try {
    // Extract request body data
    const {
      fromName,
      clientFirstName,
      clientLastName,
      clientEmail,
      clientCountry,
      clientLocation,
      clientLanguage,
      projectType,
      serviceCategory,
      clientWebsite,
      additionalInformation,
    } = req.body;

    // Check if required fields are present in the request body

    console.log(additionalInformation);
    if (
      !fromName ||
      !clientFirstName ||
      !clientLastName ||
      !clientEmail ||
      !clientCountry ||
      !clientLanguage ||
      !projectType ||
      !serviceCategory ||
      fromName.trim() === "" ||
      clientFirstName.trim() === "" ||
      clientLastName.trim() === "" ||
      clientEmail.trim() === "" ||
      clientCountry.trim() === "" ||
      clientLanguage.trim() === "" ||
      projectType.trim() === "" ||
      serviceCategory.trim() === ""
    ) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    // Call sendEmail function to send project inquiry details
    await sendEmail({
      fromName,
      clientFirstName,
      clientLastName,
      clientEmail,
      clientCountry,
      clientLocation,
      clientLanguage,
      projectType,
      serviceCategory,
      clientWebsite,
      additionalInformation,
    });

    // Generate auto-reply message using OpenAI
    const autoReplyMessage = await generateAutoReply(
      additionalInformation,
      projectType,
      serviceCategory
    );

    // Prepare and send email response to the client with the auto-reply
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail SMTP server
      port: 465, // Secure port
      secure: true, // Use secure connection
      auth: {
        user: process.env.EMAIL_USER, // Email address from environment variables
        pass: process.env.EMAIL_PASS, // Email password from environment variables
      },
    });

    const mailOptionsToClient = {
      from: process.env.EMAIL_USER, // Sender email
      to: clientEmail, // Recipient email (client's email)
      subject: `Thank you for your inquiry, ${clientFirstName}`,
      text: `Hi ${clientFirstName},\n\nThank you for reaching out to us. We received your inquiry and our team will get back to you soon. Here's the message we received from you:\n\n${autoReplyMessage}`, // Plain text version of the email body
      html: `
      <html>
      <body>
        <h3>Hi ${clientFirstName},</h3>
        <p>Thank you for reaching out to us.</p>
        <p>${autoReplyMessage}</p>
        <p>If you need any further assistance or have more details to share, please feel free to contact us.</p>
        <p>Best regards,</p>
        <p>D M Yashaswini,<br />Kvg College of Engineering</p>
      </body>
    </html>
    `, // HTML version of the email body and client message
    };

    // Send email to the client
    await transporter.sendMail(mailOptionsToClient);
    console.log("Auto-reply sent to the client:", mailOptionsToClient);

    // Respond with success message to the API caller
    res
      .status(200)
      .send({ message: "Email sent successfully and auto-reply generated" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Basic GET endpoint to welcome users
app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome folks" });
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
