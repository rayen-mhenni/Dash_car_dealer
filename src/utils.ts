type ResetPassType = {
  email: string;
  message: string;
};
export const getEmailResetPass = (params: ResetPassType) => {
  return `<p>Hello ${params.email},</p> <p><strong>You will find below a link to reset your password:</strong></p> <p><a href='${params.message}'>Reset My Password</a></p> <p>&nbsp;</p> <p>BR,<br><strong>PrimoCarthage team</strong></p>`;
};
type MeetConfirmType = {
  name: string;
  date: string;
  meet: string;
};
export const getEmailMeetConfirm = (params: MeetConfirmType) => {
  return `<p>Hello ${params.name},</p>
<p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;"><span style="font-family: arial, helvetica, sans-serif; font-size: 12pt;">I'm confirming our appointment on <strong>${params.date}</strong> to discuss. I currently have the meeting place scheduled at our location. If you want to reach me to adjust our appointment or change any of these details, please call me at<strong> (+33) 06 42 68 67 27</strong>.</span></p>
<p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;"><span style="font-family: arial, helvetica, sans-serif; font-size: 12pt;"><strong>${params.meet}</strong></span></p>
<p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;"><span style="font-family: arial, helvetica, sans-serif; font-size: 12pt;">&nbsp;We look forward to meeting you.</span></p>
<p>BR,<br><strong>Protalite team</strong></p>`;
};

export const StringToTemplate = (params: any, content: string) => {
  let tpl = eval("`" + content + "`");
  return tpl;
};

export default function getEnvValue(name: string) {
  if ((window as any).env === undefined) {
    throw new Error("env.js is missing");
  }

  const env = (window as any).env;

  if (env[name] === undefined) {
    throw new Error(`${name} is missing in env.js`);
  }

  return env[name];
}

export const getJSON = (text: any) => {
  try {
    let json = JSON.parse(text);
    return json;
  } catch (error) {
    return false;
  }
};
