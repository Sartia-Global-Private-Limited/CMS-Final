async function applicantMailTemplate(applicantName, position, interviewDate, interviewTime, location, companyName) {
    const template =
        '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Interview Schedule</title><style>body {font-family: Arial, sans-serif;font-size: 16px;line-height: 1.5;margin: 0;padding: 0;background-color: #f2f2f2;border-left: 3px solid #0055a5;border-right: 3px solid #0055a5;}header {background-color: #0055a5;padding: 20px;display: flex;justify-content: center;align-items: center;}.logo img {max-height: 100px;}main {background-color: #fff;padding: 20px;max-width: 600px;margin: 20px auto;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);border-radius: 10px;}h1 {font-size: 24px;margin-bottom: 20px;text-align: center;color: #0055a5;}p {margin-bottom: 20px;}ul {margin-bottom: 20px;padding-left: 20px;}ul li {margin-bottom: 5px;}.footer {background-color: #0055a5;color: #fff;padding: 10px 20px;font-size: 14px;display: flex;justify-content: space-between;align-items: center;flex-wrap: wrap;}.footer p {margin: 0;}.footer a {color: #fff;text-decoration: none;margin-left: 10px;}@media screen and (max-width: 600px) {main {border-radius: 0;}}</style></head><body><header><div class="logo"><img src="https://sartiaglobal.com/img/logo.webp" alt="Company Logo"></div></header><main><h1>Interview Schedule</h1><p>Dear ' +
        applicantName +
        ",</p><p>We are pleased to inform you that we have scheduled your interview for the position of <b>" +
        position +
        "</b> at <b>" +
        companyName +
        "</b>. We appreciate your interest in the position and are excited to learn more about your qualifications and experience.</p><p>Your interview has been scheduled for <b>" +
        interviewDate +
        "</b> at " +
        interviewTime +
        " and will be conducted at our office located at <b>" +
        location +
        "</b>.</p><p>Please be advised that we have a dress code at our workplace, and we kindly ask that you dress appropriately for the interview.</p><p>If you have any questions or concerns about the interview, please do not hesitate to contact us at hr@sartiaglobal.com. We look forward to meeting you and discussing your application further.</p><p>Thank you for your interest in our company, and we wish you all the best for the interview.</p><p>Best regards,</p><p>HR team</p><p>" +
        companyName +
        '</p></main><footer class="footer"><p>&copy; 2023 ' +
        companyName +
        '. All rights reserved.</p><div><a href="#">Privacy Policy</a><a href="#">Terms of Use</a><a href="#">Contact Us</a></div></footer></body></html>';
    return template;
}

async function interviewerMailTemplate(interviewerName, position, companyName, interviewDate, interviewTime, location) {
    const template =
        '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Interview Schedule</title><style>body {font-family: Arial, sans-serif;font-size: 16px;line-height: 1.5;margin: 0;padding: 0;background-color: #f2f2f2;border-left: 3px solid #0055a5;border-right: 3px solid #0055a5;}header {background-color: #0055a5;padding: 20px;display: flex;justify-content: center;align-items: center;}.logo img {max-height: 100px;}main {background-color: #fff;padding: 20px;max-width: 600px;margin: 20px auto;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);border-radius: 10px;}h1 {font-size: 24px;margin-bottom: 20px;text-align: center;color: #0055a5;}p {margin-bottom: 20px;}ul {margin-bottom: 20px;padding-left: 20px;}ul li {margin-bottom: 5px;}.footer {background-color: #0055a5;color: #fff;padding: 10px 20px;font-size: 14px;display: flex;justify-content: space-between;align-items: center;flex-wrap: wrap;}.footer p {margin: 0;}.footer a {color: #fff;text-decoration: none;margin-left: 10px;}@media screen and (max-width: 600px) {main {border-radius: 0;}}</style></head><body><header><div class="logo"><img src="https://sartiaglobal.com/img/logo.webp" alt="Company Logo"></div></header><main><h1>Interview Schedule</h1><p>Dear ' +
        interviewerName +
        ",</p><p>We are pleased to inform you that you have been selected to interview a candidate for the position of <b>" +
        position +
        "</b> at <b>" +
        companyName +
        "</b>. We appreciate your willingness to participate in the interview process and are confident that your expertise and experience will be an asset to our hiring team.</p><p>Your interview has been scheduled for <b>" +
        interviewDate +
        "</b> at <b>" +
        interviewTime +
        "</b> and will be conducted at our office located at <b>" +
        location +
        "</b>.</p><p>As an interviewer, you play a critical role in evaluating the candidate qualifications and suitability for the position. Please review the candidate application materials and come prepared with relevant questions to help us make an informed hiring decision.</p><p>If you have any questions or concerns regarding the interview, please do not hesitate to contact us at <b>hr@sartiaglobal.com</b>. We appreciate your contribution to the hiring process and look forward to working with you.</p><p>Thank you for your time and dedication to our company.</p><p>Best Regards,</p><p>HR Team</p><p>" +
        companyName +
        "</p></main>" +
        '<footer class="footer"><p>&copy; 2023 ' +
        companyName +
        '. All rights reserved.</p><div><a href="#">Privacy Policy</a><a href="#">Terms of Use</a><a href="#">Contact Us</a></div></footer></body></html>';
    return template;
}

async function applicantOfferMailTemplate(
    company_name,
    job_level,
    salary,
    joining_date,
    benefits_information,
    acceptButtonLink
) {
    const template =
        "<!DOCTYPE html><html><head><title>Job Offer from " +
        company_name +
        '</title><style type="text/css"> body {font-family: Arial, sans-serif;font-size: 16px;line-height: 1.5;color: #333;} h1 {font-size: 28px;margin-bottom: 0;} h2 {font-size: 24px;margin-top: 0;} p {margin-top: 0;margin-bottom: 1em;} .job-details {width: 70%;margin: 0 auto; border-collapse: collapse;margin-bottom: 1em;} .job-details th {text-align: left;padding: 0.5em;border: 1px solid #ccc;}.job-details td {text-align: right;padding: 0.5em;border: 1px solid #ccc;}.button {display: inline-block;padding: 1em;background-color: #0055a5; color: #fff; text-decoration: none;border-radius: 4px;font-weight: bold;text-align: center;transition: background-color 0.3s ease;}.button:hover {background-color: #0062cc;} .header { display: flex;align-items: center;justify-content: space-between;padding: 1em;background-color: #0055a5; color: #fff} .header h3 {margin: 0;}.logo {width: 150px;margin-right: 20px;} .company-name {display: flex;align-items: center;} .company-name h3 {margin: 0;margin-right: 10px;} .footer {background-color: #0055a5;color: #fff;padding: 10px 20px;font-size: 14px;display: flex;justify-content: space-between;align-items: center;flex-wrap: wrap;}.footer p {margin: 0;}.footer a {color: #fff;text-decoration: none;margin-left: 10px;}</style></head><body><div class="header"><div class="company-name"><img class="logo" src="https://sartiaglobal.com/img/logo.webp" alt="' +
        company_name +
        '"><h3>' +
        company_name +
        "</h3></div></div><h1>Job Offer from " +
        company_name +
        "</h1><p>Congratulations! We are pleased to offer you a job at " +
        company_name +
        '. Please find the details of the offer below:</p><table class="job-details"><tbody><tr><th>Position:</th><td>' +
        job_level +
        "</td></tr><tr><th>Salary:</th><td>Rs." +
        salary +
        " per year</td></tr><tr><th>Start Date:</th><td>" +
        joining_date +
        "</td></tr><tr><th>Benefits:</th><td>" +
        benefits_information +
        '</td></tr></tbody></table><p>Please click the button below to accept the offer.</p><a href="' +
        acceptButtonLink +
        '" class="button">Accept Offer</a><p>If you have any questions or concerns, please do not hesitate to contact us. We look forward to hearing from you.</p><h2>Sincerely,</h2><p>' +
        company_name +
        ' Team</p><footer class="footer"><p>&copy; 2023 ' +
        company_name +
        '. All rights reserved.</p><div><a href="#">Privacy Policy</a><a href="#">Terms of Use</a><a href="#">Contact Us</a></div></footer></body></html>';

    return template;
}

async function generalTemplates() {
    const template =
        '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Interview Schedule</title><style>body {font-family: Arial, sans-serif;font-size: 16px;line-height: 1.5;margin: 0;padding: 0;background-color: #f2f2f2;border-left: 5px solid #0055a5;border-right: 5px solid #0055a5;}header {background-color: #0055a5;padding: 20px;display: flex;justify-content: center;align-items: center;}.logo img {max-height: 100px;}main {background-color: #fff;padding: 20px;max-width: 600px;margin: 20px auto;box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);border-radius: 10px;}h1 {font-size: 24px;margin-bottom: 20px;text-align: center;color: #0055a5;}p {margin-bottom: 20px;}ul {margin-bottom: 20px;padding-left: 20px;}ul li {margin-bottom: 5px;}.footer {background-color: #0055a5;color: #fff;padding: 10px 20px;font-size: 14px;display: flex;justify-content: space-between;align-items: center;flex-wrap: wrap;}.footer p {margin: 0;}.footer a {color: #fff;text-decoration: none;margin-left: 10px;}@media screen and (max-width: 600px) {main {border-radius: 0;}}</style></head><body><header><div class="logo"><img src="https://sartiaglobal.com/img/logo.webp" alt="Company Logo"></div></header><main><h1>Interview Schedule</h1><p>Dear ' +
        interviewerName +
        ",</p><p>We are pleased to inform you that you have been selected to interview a candidate for the position of <b>" +
        position +
        "</b> at <b>" +
        companyName +
        "</b>. We appreciate your willingness to participate in the interview process and are confident that your expertise and experience will be an asset to our hiring team.</p><p>Your interview has been scheduled for <b>" +
        interviewDate +
        "</b> at <b>" +
        interviewTime +
        "</b> and will be conducted at our office located at <b>" +
        location +
        "</b>.</p><p>As an interviewer, you play a critical role in evaluating the candidate qualifications and suitability for the position. Please review the candidate application materials and come prepared with relevant questions to help us make an informed hiring decision.</p><p>If you have any questions or concerns regarding the interview, please do not hesitate to contact us at <b>hr@sartiaglobal.com</b>. We appreciate your contribution to the hiring process and look forward to working with you.</p><p>Thank you for your time and dedication to our company.</p><p>Best Regards,</p><p>HR Team</p><p>" +
        companyName +
        "</p></main>" +
        '<footer class="footer"><p>&copy; 2023 ' +
        companyName +
        '. All rights reserved.</p><div><a href="#">Privacy Policy</a><a href="#">Terms of Use</a><a href="#">Contact Us</a></div></footer></body></html>';

    return template;
}

function generateEmailTemplate(name, email, password, userRole = "CLIENT", loginLink = "http://client.cmsithub.com") {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: blue;
      padding: 20px;
      text-align: center;
      color: white;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      font-size: 16px;
      line-height: 1.5;
      color: #555;
    }
    .credentials {
      background-color: #f9f9f9;
      padding: 15px;
      margin-top: 15px;
      border-radius: 8px;
      font-family: monospace;
    }
    .footer {
      padding: 10px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      color: white;
      background-color: blue;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
    }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Welcome to CMS Electronics</div>
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>You have been successfully registered as a <strong>${userRole}</strong>.</p>
          <div class="credentials">
            <p><strong>Username:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          <p><a href="${loginLink}" class="btn">Login to Your Account</a></p>
        </div>
        <div class="footer">© CMS IT HUB | This is an automated email, please do not reply.</div>
      </div>
    </body>
    </html>`;
}

function generateContactEmailTemplate(payload) {
    return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: blue;
        padding: 20px;
        text-align: center;
        color: white;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
      }
      .footer {
        padding: 10px;
        text-align: center;
        font-size: 12px;
        color: #888;
      }
      .bold {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
        <div class="header">CMS Electricals</div>
        <div class="content">
          <p class="bold">${payload.title}</p>
          ${payload.message}
        </div>
        <div class="footer">© CMS IT HUB | This is an automated email, please do not reply.</div>
      </div>
  </body>
</html>
`;
}

module.exports = {
    applicantMailTemplate,
    interviewerMailTemplate,
    applicantOfferMailTemplate,
    generalTemplates,
    generateEmailTemplate,
    generateContactEmailTemplate,
};
