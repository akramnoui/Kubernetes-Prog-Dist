const sendResetPasswordEmail = async (email, resetPasswordToken) => {
    try {
      const emailContent = `
        <p>You have requested to reset your password.</p>
        <p>Please click on the following link to reset your password:</p>
        <a href="http://yourdomain.com/reset-password?token=${resetPasswordToken}">Reset Password</a>
      `;
  
    //   await emailService.sendEmail({
    //     to: email,
    //     subject: 'Reset Your Password',
    //     html: emailContent
    //   });
    } catch (error) {
      throw new Error('Error sending reset password email');
    }
  };

  const sendVerificationEmail = async (email, verifyEmailToken) => {
    try {
      const emailContent = `
        <p>Thank you for registering an account.</p>
        <p>Please click on the following link to verify your email address:</p>
        <a href="http://yourdomain.com/verify-email?token=${verifyEmailToken}">Verify Email</a>
      `;
  
      // await emailService.sendEmail({
      //   to: email,
      //   subject: 'Verify Your Email Address',
      //   html: emailContent
      // });
    } catch (error) {
      throw new Error('Error sending verification email');
    }
  };
  
  module.exports = {
    sendResetPasswordEmail,
    sendVerificationEmail
  };