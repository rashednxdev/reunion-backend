import { getWorkplaceDisplay } from '../utils/workplace.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildFamilyRows(members = []) {
  if (!members.length) {
    return `<tr><td colspan="2" style="padding:8px 0;color:#64748b;font-size:13px;">No family members registered.</td></tr>`;
  }

  return members
    .map((member) => {
      const ageLabel =
        member.relation?.toLowerCase() !== 'spouse' && member.ageGroup
          ? ` · ${escapeHtml(member.ageGroup)}`
          : '';
      return `
        <tr>
          <td style="padding:6px 0;color:#334155;font-size:13px;font-weight:600;">${escapeHtml(member.name)}</td>
          <td style="padding:6px 0;color:#64748b;font-size:12px;text-align:right;">${escapeHtml(member.relation)}${ageLabel}</td>
        </tr>`;
    })
    .join('');
}

export function buildApprovalEmailHtml(registration, { ticketUrl, registerUrl }) {
  const fullName = escapeHtml(registration.fullName);
  const mobile = escapeHtml(registration.mobile);
  const ticketId = escapeHtml(registration.ticketId);
  const workplace = escapeHtml(getWorkplaceDisplay(registration));
  const tshirtSize = escapeHtml(registration.tshirtSize || 'N/A');
  const guestCount = registration.members?.length || 0;
  const lunchCount = 1 + guestCount;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Approved — CGA Grand Reunion 2026</title>
</head>
<body style="margin:0;padding:0;background:#0b0f19;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0f19;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:18px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#e0f2fe,#dbeafe);padding:28px 24px 22px;text-align:center;border-bottom:1px dashed #7dd3fc;">
              <div style="display:inline-block;background:#dcfce7;color:#15803d;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:6px 14px;border-radius:999px;border:1px solid #bbf7d0;margin-bottom:10px;">
                Registration Approved
              </div>
              <div style="font-size:11px;font-weight:700;color:#64748b;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:6px;">CGA Batch 2018</div>
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;color:#d97706;">Grand Reunion 2026</h1>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#334155;">
                Dear <strong>${fullName}</strong>,<br />
                Your registration has been approved. Your reunion ticket is ready below.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #bae6fd;border-radius:12px;text-align:left;">
                <tr><td style="padding:10px 14px;font-size:13px;color:#1d4ed8;font-weight:700;">📅 Saturday, 22 August 2026</td></tr>
                <tr><td style="padding:0 14px 10px;font-size:13px;color:#dc2626;font-weight:700;">📍 BGB Banquet Hall, Shimanto Shambhar, Dhanmondi</td></tr>
                <tr><td style="padding:0 14px 12px;font-size:13px;color:#15803d;font-weight:700;">⏰ 11:00 AM – 7:00 PM</td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(135deg,#e0f2fe,#eff6ff);border:1px solid #7dd3fc;border-radius:14px;margin-bottom:18px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="font-size:11px;font-weight:700;color:#0369a1;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:6px;">Ticket Number</div>
                    <div style="font-size:30px;font-weight:900;color:#0c4a6e;letter-spacing:0.06em;line-height:1;">${ticketId}</div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:18px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #e0f2fe;font-size:12px;color:#64748b;width:42%;">Attendee Name</td>
                  <td style="padding:8px 0;border-bottom:1px solid #e0f2fe;font-size:13px;color:#d97706;font-weight:700;text-align:right;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #e0f2fe;font-size:12px;color:#64748b;">Mobile</td>
                  <td style="padding:8px 0;border-bottom:1px solid #e0f2fe;font-size:13px;color:#2563eb;font-weight:700;text-align:right;">${mobile}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #e0f2fe;font-size:12px;color:#64748b;">Workplace</td>
                  <td style="padding:8px 0;border-bottom:1px solid #e0f2fe;font-size:13px;color:#15803d;font-weight:700;text-align:right;">${workplace}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:12px;color:#64748b;">Total Members</td>
                  <td style="padding:8px 0;font-size:13px;color:#db2777;font-weight:700;text-align:right;">1 + ${guestCount} Guest(s)</td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fdf2f8;border:1px solid #fbcfe8;border-radius:12px;margin-bottom:18px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <div style="font-size:10px;font-weight:700;color:#db2777;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px;">Family Members</div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      ${buildFamilyRows(registration.members)}
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:22px;">
                <tr>
                  <td width="33%" style="padding:8px;border:2px dashed #f9a8d4;background:#ffffff;border-radius:10px;text-align:center;">
                    <div style="font-size:12px;font-weight:700;color:#1f2937;">LUNCH</div>
                    <div style="font-size:10px;color:#db2777;font-weight:700;letter-spacing:0.08em;">x${lunchCount} BOX</div>
                  </td>
                  <td width="33%" style="padding:8px;border:2px dashed #fcd34d;background:#ffffff;border-radius:10px;text-align:center;">
                    <div style="font-size:12px;font-weight:700;color:#1f2937;">T-SHIRT</div>
                    <div style="font-size:10px;color:#d97706;font-weight:700;letter-spacing:0.08em;">SIZE ${tshirtSize}</div>
                  </td>
                  <td width="33%" style="padding:8px;border:2px dashed #86efac;background:#ffffff;border-radius:10px;text-align:center;">
                    <div style="font-size:12px;font-weight:700;color:#1f2937;">SOUVENIR</div>
                    <div style="font-size:10px;color:#15803d;font-weight:700;letter-spacing:0.08em;">COLLECT</div>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto 14px;">
                <tr>
                  <td style="border-radius:12px;background:linear-gradient(135deg,#ffbe0b,#fb5607);">
                    <a href="${ticketUrl}" style="display:inline-block;padding:14px 28px;color:#111827;font-size:14px;font-weight:800;text-decoration:none;letter-spacing:0.04em;">
                      View &amp; Download Ticket
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;line-height:1.7;color:#64748b;text-align:center;">
                You can also check your registration status anytime at
                <a href="${registerUrl}" style="color:#2563eb;text-decoration:none;font-weight:700;">the reunion registration page</a>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#e0f2fe;padding:16px 24px;text-align:center;border-top:1px dashed #7dd3fc;">
              <p style="margin:0;font-size:11px;color:#64748b;line-height:1.6;">
                CGA Batch 2018 Grand Reunion 2026 · Please bring this ticket (digital or printed) on event day.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildApprovalEmailText(registration, { ticketUrl, registerUrl }) {
  const workplace = getWorkplaceDisplay(registration);
  const guestCount = registration.members?.length || 0;
  const membersText = (registration.members || [])
    .map((m) => `- ${m.name} (${m.relation}${m.ageGroup ? `, ${m.ageGroup}` : ''})`)
    .join('\n');

  return `Dear ${registration.fullName},

Your registration for CGA Batch 2018 Grand Reunion 2026 has been APPROVED.

Event: Saturday, 22 August 2026
Venue: BGB Banquet Hall, Shimanto Shambhar, 4th Floor, Road #2, Dhanmondi 1205, Dhaka, Bangladesh
Time: 11:00 AM – 7:00 PM

Ticket Number: ${registration.ticketId}
Mobile: ${registration.mobile}
Workplace: ${workplace}
Total Members: 1 + ${guestCount} Guest(s)

Family Members:
${membersText || 'None'}

View & Download Ticket: ${ticketUrl}
Registration Page: ${registerUrl}

Please bring this ticket (digital or printed) on event day.`;
}
