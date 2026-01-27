import emailjs from "@emailjs/browser";

// Initialize EmailJS with your Public Key
export const initializeEmailJS = () => {
  // You'll need to set these in your .env.local file
  // Get your Service ID, Template ID, and Public Key from emailjs.com
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
};

// Function to send interest notification from frontend (optional)
export const sendInterestNotification = async (fromUserName, toUserEmail) => {
  try {
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_INTEREST_TEMPLATE_ID,
      {
        to_email: toUserEmail,
        from_name: fromUserName,
        message: `${fromUserName} is interested in you!`,
      }
    );
    console.log("Interest email sent:", response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Function to send acceptance notification from frontend (optional)
export const sendAcceptanceNotification = async (acceptedUserName, toUserEmail) => {
  try {
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_ACCEPTANCE_TEMPLATE_ID,
      {
        to_email: toUserEmail,
        from_name: acceptedUserName,
        message: `${acceptedUserName} accepted your interest!`,
      }
    );
    console.log("Acceptance email sent:", response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
