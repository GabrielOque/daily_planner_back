// utils/sendInvitationEmail.js
import { format } from "date-fns";
import { localToUTC, stringToDate } from "../utils/convertionDate.js";
import { transporter } from "../libs/nodemailer.js";
import { FRONTEND_URL } from "../config.js";

/**
 * Envía una invitación con archivo .ics por email
 * @param {Object} params
 * @param {string[]} params.to - lista de correos
 * @param {string} params.name - nombre del evento
 * @param {string} params.description
 * @param {string} params.startDate - formato YYYY-MM-DD
 * @param {string} params.startTime - formato HH:mm
 * @param {string} params.endTime - formato HH:mm
 * @param {string} params.roomName - nombre de la sala en LiveKit
 */
export const sendInvitationEmail = async ({
  to,
  name,
  description,
  startDate,
  startTime,
  endTime,
  roomName,
  userName,
  userEmail,
}) => {
  const start = localToUTC(`${startDate}T${startTime}`);
  const end = localToUTC(`${startDate}T${endTime}`);

  const meetingUrl = `${FRONTEND_URL}/planner/join-meeting?roomName=${roomName}`;
  const uid = `${roomName}@dailyplanner.site`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DailyPlanner//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}`,
    `DTSTART:${format(start, "yyyyMMdd'T'HHmmss'Z'")}`,
    `DTEND:${format(end, "yyyyMMdd'T'HHmmss'Z'")}`,
    `SUMMARY:${name}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}\\nUnirse: ${meetingUrl}`,
    `LOCATION:${meetingUrl}`,
    "STATUS:CONFIRMED",
    `ORGANIZER;CN=${userName}:mailto:${userEmail}`,
    `ATTENDEE;CN=${userName};RSVP=TRUE:mailto:${userEmail}`,
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Recordatorio de reunión",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  await transporter.sendMail({
    from: '"Daily Planner" <oquendodev@gmail.com>',
    to: to,
    subject: `Invitación: ${name}`,
    text: `Hola, "${userName}" te ha invitado al evento "${name}".\n\nDescripción: ${description}\n\nUnirse: ${meetingUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #4F46E5;">¡Nueva Invitación!</h2>
        <p><strong>${userName}</strong> te ha invitado al evento: <strong>${name}</strong>.</p>
        <p><strong>Descripción:</strong> ${description}</p>
        <p>
          <a href="${meetingUrl}"
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
            Unirse a la Reunión
          </a>
        </p>
      </div>
    `,
    icalEvent: {
      filename: "invitacion.ics",
      method: "REQUEST",
      content: icsContent,
    },
  });
};

export const sendUpdateNotification = async ({
  to,
  name,
  description,
  startDate,
  startTime,
  endTime,
  roomName,
  userName,
  userEmail,
}) => {
  const start = localToUTC(`${startDate}T${startTime}`);
  const end = localToUTC(`${startDate}T${endTime}`);

  const meetingUrl = `${FRONTEND_URL}/planner/join-meeting?roomName=${roomName}`;
  const uid = `${roomName}@dailyplanner.site`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DailyPlanner//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}`,
    `DTSTART:${format(start, "yyyyMMdd'T'HHmmss'Z'")}`,
    `DTEND:${format(end, "yyyyMMdd'T'HHmmss'Z'")}`,
    `SUMMARY:${name}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}\\nUnirse: ${meetingUrl}`,
    `LOCATION:${meetingUrl}`,
    "STATUS:CONFIRMED",
    `ORGANIZER;CN=${userName}:mailto:${userEmail}`,
    `ATTENDEE;CN=${userName};RSVP=TRUE:mailto:${userEmail}`,
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Recordatorio de reunión",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  await transporter.sendMail({
    from: '"Daily Planner" <oquendodev@gmail.com>',
    to: to,
    subject: `Invitación: ${name}`,
    text: `Hola, "${userName}" ha actualizado el evento "${name}".\n\nDescripción: ${description}\n\nUnirse: ${meetingUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #4F46E5;">¡Invitación actualizada!</h2>
        <p><strong>${userName}</strong> ha actualizado el evento: <strong>${name}</strong>.</p>
        <p><strong>Descripción:</strong> ${description}</p>
        <p>
          <a href="${meetingUrl}"
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
            Unirse a la Reunión
          </a>
        </p>
      </div>
    `,
    icalEvent: {
      filename: "invitacion.ics",
      method: "REQUEST",
      content: icsContent,
    },
  });
};
