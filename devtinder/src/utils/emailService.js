// const nodemailer = require("nodemailer");

// // Create transporter using Gmail (you can use any email service)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Verify transporter connection on startup
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("Email transporter error:", error);
//   } else {
//     console.log("Email transporter ready! Emails can be sent.");
//   }
// });

// // Function to send interest email
// const sendInterestEmail = async (fromUser, toUser) => {
//   try {
//     console.log(
//       `[EMAIL] Sending interest email from ${fromUser.firstName} to ${toUser.email}`,
//     );

//     if (!toUser.email) {
//       console.error(
//         `[EMAIL] Error: Recipient email not found for user ${toUser._id}`,
//       );
//       return false;
//     }

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: toUser.email,
//       subject: `${fromUser.firstName} is interested in you! 💌`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #ff6b6b;">Great News! 🎉</h2>
//           <p>Hi ${toUser.firstName},</p>
//           <p><strong>${fromUser.firstName} ${fromUser.lastName || ""}</strong> is interested in connecting with you!</p>

//           <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3>${fromUser.firstName} ${fromUser.lastName || ""}</h3>
//             <p><strong>Age:</strong> ${fromUser.age || "Not specified"}</p>
//             <p><strong>Gender:</strong> ${fromUser.gender || "Not specified"}</p>
//             <p><strong>About:</strong> ${fromUser.about || "No description"}</p>
//             ${
//               fromUser.skills && fromUser.skills.length > 0
//                 ? `<p><strong>Skills:</strong> ${fromUser.skills.join(", ")}</p>`
//                 : ""
//             }
//           </div>

//           <p style="margin-top: 20px;">
//             <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}" style="background-color: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
//               Check Profile & Respond
//             </a>
//           </p>

//           <p style="color: #666; margin-top: 30px; font-size: 12px;">
//             DevTinder - Your dating app for developers
//           </p>
//         </div>
//       `,
//     };

//     const result = await transporter.sendMail(mailOptions);
//     console.log(
//       `[EMAIL] ✅ Interest email sent successfully to ${toUser.email}`,
//     );
//     console.log(`[EMAIL] Message ID: ${result.messageId}`);
//     return true;
//   } catch (error) {
//     console.error("[EMAIL] ❌ Error sending interest email:", error.message);
//     console.error("[EMAIL] Full error:", error);
//     return false;
//   }
// };

// // Function to send acceptance email
// const sendAcceptanceEmail = async (fromUser, toUser) => {
//   try {
//     console.log(
//       `[EMAIL] Sending acceptance email from ${fromUser.firstName} to ${toUser.email}`,
//     );

//     if (!toUser.email) {
//       console.error(
//         `[EMAIL] Error: Recipient email not found for user ${toUser._id}`,
//       );
//       return false;
//     }

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: toUser.email,
//       subject: `${fromUser.firstName} accepted your interest! 💑`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #51cf66;">Awesome! It's a Match! 🎊</h2>
//           <p>Hi ${toUser.firstName},</p>
//           <p><strong>${fromUser.firstName} ${fromUser.lastName || ""}</strong> has accepted your interest!</p>
//           <p>You two are now connected. Start chatting and get to know each other!</p>

//           <p style="margin-top: 20px;">
//             <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/connections" style="background-color: #51cf66; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
//               View Connections
//             </a>
//           </p>

//           <p style="color: #666; margin-top: 30px; font-size: 12px;">
//             DevTinder - Your dating app for developers
//           </p>
//         </div>
//       `,
//     };

//     const result = await transporter.sendMail(mailOptions);
//     console.log(
//       `[EMAIL] ✅ Acceptance email sent successfully to ${toUser.email}`,
//     );
//     console.log(`[EMAIL] Message ID: ${result.messageId}`);
//     return true;
//   } catch (error) {
//     console.error("[EMAIL] ❌ Error sending acceptance email:", error.message);
//     console.error("[EMAIL] Full error:", error);
//     return false;
//   }
// };

// module.exports = { sendInterestEmail, sendAcceptanceEmail };
const nodemailer = require("nodemailer");

let transporter = null;

// ===== Safe Initialization =====
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
    pool: true,
    maxConnections: 1,
  });

  // Don't verify connection on startup (causes timeout on Render)
  console.log("📧 Email transporter initialized");
} else {
  console.warn("📭 Email disabled: missing credentials");
}

// ===== Internal Safe Sender =====
const safeSendMail = async (mailOptions) => {
  if (!transporter) {
    console.warn("📭 Email skipped: transporter not available");
    return false;
  }

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("📨 Email sent:", result.messageId);
    return true;
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    return false;
  }
};

// ===== Interest Email =====
const sendInterestEmail = async (fromUser, toUser) => {
  if (!toUser.email) return false;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toUser.email,
    subject: `${fromUser.firstName} is interested in you! 💌`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b6b;">Great News! 🎉</h2>
        <p>Hi ${toUser.firstName},</p>
        <p><strong>${fromUser.firstName} ${fromUser.lastName || ""}</strong> is interested in connecting with you!</p>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>${fromUser.firstName} ${fromUser.lastName || ""}</h3>
          <p><strong>Age:</strong> ${fromUser.age || "Not specified"}</p>
          <p><strong>Gender:</strong> ${fromUser.gender || "Not specified"}</p>
          <p><strong>About:</strong> ${fromUser.about || "No description"}</p>
          ${
            fromUser.skills?.length
              ? `<p><strong>Skills:</strong> ${fromUser.skills.join(", ")}</p>`
              : ""
          }
        </div>

        <p style="margin-top: 20px;">
          <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}"
             style="background-color: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Check Profile & Respond
          </a>
        </p>

        <p style="color: #666; margin-top: 30px; font-size: 12px;">
          DevTinder - Your dating app for developers
        </p>
      </div>
    `,
  };

  return await safeSendMail(mailOptions);
};

// ===== Acceptance Email =====
const sendAcceptanceEmail = async (fromUser, toUser) => {
  if (!toUser.email) return false;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toUser.email,
    subject: `${fromUser.firstName} accepted your interest! 💑`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #51cf66;">Awesome! It's a Match! 🎊</h2>
        <p>Hi ${toUser.firstName},</p>
        <p><strong>${fromUser.firstName} ${fromUser.lastName || ""}</strong> has accepted your interest!</p>
        <p>You two are now connected. Start chatting and get to know each other!</p>

        <p style="margin-top: 20px;">
          <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/connections"
             style="background-color: #51cf66; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Connections
          </a>
        </p>

        <p style="color: #666; margin-top: 30px; font-size: 12px;">
          DevTinder - Your dating app for developers
        </p>
      </div>
    `,
  };

  return await safeSendMail(mailOptions);
};

module.exports = { sendInterestEmail, sendAcceptanceEmail };
