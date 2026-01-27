const nodemailer = require("nodemailer");

// Create transporter using Gmail (you can use any email service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send interest email
const sendInterestEmail = async (fromUser, toUser) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toUser.email,
      subject: `${fromUser.firstName} is interested in you! 💌`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b6b;">Great News! 🎉</h2>
          <p>Hi ${toUser.firstName},</p>
          <p><strong>${fromUser.firstName} ${fromUser.lastName}</strong> is interested in connecting with you!</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${fromUser.firstName} ${fromUser.lastName}</h3>
            <p><strong>Age:</strong> ${fromUser.age || "Not specified"}</p>
            <p><strong>Gender:</strong> ${fromUser.gender || "Not specified"}</p>
            <p><strong>About:</strong> ${fromUser.about || "No description"}</p>
            ${
              fromUser.skills && fromUser.skills.length > 0
                ? `<p><strong>Skills:</strong> ${fromUser.skills.join(", ")}</p>`
                : ""
            }
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}" style="background-color: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Check Profile & Respond
            </a>
          </p>
          
          <p style="color: #666; margin-top: 30px; font-size: 12px;">
            DevTinder - Your dating app for developers
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${toUser.email}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Function to send acceptance email
const sendAcceptanceEmail = async (fromUser, toUser) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toUser.email,
      subject: `${fromUser.firstName} accepted your interest! 💑`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #51cf66;">Awesome! It's a Match! 🎊</h2>
          <p>Hi ${toUser.firstName},</p>
          <p><strong>${fromUser.firstName} ${fromUser.lastName}</strong> has accepted your interest!</p>
          <p>You two are now connected. Start chatting and get to know each other!</p>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/connections" style="background-color: #51cf66; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Connections
            </a>
          </p>
          
          <p style="color: #666; margin-top: 30px; font-size: 12px;">
            DevTinder - Your dating app for developers
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Acceptance email sent successfully to ${toUser.email}`);
    return true;
  } catch (error) {
    console.error("Error sending acceptance email:", error);
    return false;
  }
};

module.exports = { sendInterestEmail, sendAcceptanceEmail };
