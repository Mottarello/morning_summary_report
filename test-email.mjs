import { sendMorningReportEmail } from './server/emailService.ts';

console.log('[Test] Sending test email to mottarello1@gmail.com...');
const result = await sendMorningReportEmail('mottarello1@gmail.com');
console.log('[Test] Email send result:', result ? 'SUCCESS' : 'FAILED');
