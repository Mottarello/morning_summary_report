const apiKey = process.env.EMAIL_SERVICE_API_KEY;
const provider = process.env.EMAIL_SERVICE_PROVIDER;

console.log(`[Test] Email Provider: ${provider}`);
console.log(`[Test] API Key Present: ${apiKey ? 'Yes' : 'No'}`);

// Generate HTML content
const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Daily Morning Summary Report</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background-color: #1a2e4a; color: #f5f1e8; padding: 32px 24px; border-bottom: 4px solid #c85a17;">
      <h1 style="margin: 0; font-size: 36px;">Morning Summary</h1>
      <p style="margin: 8px 0; font-size: 16px; color: #d4c5b0;">Your daily digest of world news, tech announcements, economic updates, and local insights</p>
      <p style="margin: 0; font-size: 12px; color: #a89a8a;">${today}</p>
    </div>
    <div style="padding: 32px 24px;">
      <h2 style="margin: 0 0 24px 0; font-size: 24px; color: #1a2e4a;">Today's Top Stories</h2>
      
      <div style="margin-bottom: 24px; padding: 16px; border-left: 4px solid #c85a17; background-color: #f9f9f9;">
        <div style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 8px; font-weight: 600;">AI & STARTUPS</div>
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #1a1a1a;">Amazon Invests $50 Billion in AI and Supercomputing</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; font-weight: 600;">Major expansion of AWS infrastructure for federal agencies</p>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #333; line-height: 1.6;">Amazon has announced a significant investment of up to $50 billion to expand its AI and supercomputing capabilities for Amazon Web Services (AWS) in the U.S. federal agencies sector.</p>
        <div style="font-size: 12px; color: #999;">6 hours ago</div>
      </div>

      <div style="margin-bottom: 24px; padding: 16px; border-left: 4px solid #c85a17; background-color: #f9f9f9;">
        <div style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 8px; font-weight: 600;">ECONOMY</div>
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #1a1a1a;">UK State Pension to Rise 4.8% from April 2026</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; font-weight: 600;">New state pension will reach £12,547.60 annually</p>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #333; line-height: 1.6;">The Basic State Pension and Single Tier State Pension are set to rise by 4.8% from April 2026, increasing the new state pension to approximately £12,547.60 a year.</p>
        <div style="font-size: 12px; color: #999;">2 hours ago</div>
      </div>

      <div style="margin-bottom: 24px; padding: 16px; border-left: 4px solid #c85a17; background-color: #f9f9f9;">
        <div style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 8px; font-weight: 600;">LOCAL NEWS</div>
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #1a1a1a;">RWS Achieves 1 Trillion Words Translated with AI</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; font-weight: 600;">Maidenhead-based company reaches major AI translation milestone</p>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #333; line-height: 1.6;">Maidenhead-based content solutions company RWS has achieved a major AI translation milestone, reporting over 1 trillion words translated in the past year.</p>
        <div style="font-size: 12px; color: #999;">3 hours ago</div>
      </div>
    </div>
    <div style="background-color: #1a2e4a; color: #f5f1e8; padding: 24px; border-top: 4px solid #c85a17; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #a89a8a;">© 2025 Daily Morning Summary Report. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const textContent = `DAILY MORNING SUMMARY REPORT
${today}

Your daily digest of world news, tech announcements, economic updates, and local insights

AI & STARTUPS
Amazon Invests $50 Billion in AI and Supercomputing
Major expansion of AWS infrastructure for federal agencies
Amazon has announced a significant investment of up to $50 billion to expand its AI and supercomputing capabilities for Amazon Web Services (AWS) in the U.S. federal agencies sector.
6 hours ago

ECONOMY
UK State Pension to Rise 4.8% from April 2026
New state pension will reach £12,547.60 annually
The Basic State Pension and Single Tier State Pension are set to rise by 4.8% from April 2026, increasing the new state pension to approximately £12,547.60 a year.
2 hours ago

LOCAL NEWS
RWS Achieves 1 Trillion Words Translated with AI
Maidenhead-based company reaches major AI translation milestone
Maidenhead-based content solutions company RWS has achieved a major AI translation milestone, reporting over 1 trillion words translated in the past year.
3 hours ago

© 2025 Daily Morning Summary Report. All rights reserved.
You received this email because you subscribed to the morning summary report.
`;

if (provider === 'resend') {
  console.log('[Test] Sending via Resend...');
  fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Morning Summary <noreply@morningsummary.manus.space>',
      to: 'mottarello1@gmail.com',
      subject: `Daily Morning Summary - ${today}`,
      html: htmlContent,
      text: textContent,
    }),
  })
  .then(response => {
    console.log('[Test] Response Status:', response.status);
    return response.json();
  })
  .then(result => {
    console.log('[Test] Response:', JSON.stringify(result, null, 2));
    if (result.id) {
      console.log('[Test] ✓ Email sent successfully! ID:', result.id);
    } else {
      console.log('[Test] ✗ Email send failed');
    }
  })
  .catch(error => {
    console.error('[Test] Error:', error.message);
  });
}
