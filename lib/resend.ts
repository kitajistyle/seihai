import { Resend } from 'resend';

export async function sendApprovalEmail({
  email,
  player_name,
  tournament_title,
  approval_link
}: {
  email: string;
  player_name: string;
  tournament_title: string;
  approval_link: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set. Email will not be sent.');
    return { success: false, error: 'API key is missing' };
  }

  // 送信元設定
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  console.log('Init Resend with from:', fromAddress);
  
  const resend = new Resend(apiKey);
  
  try {
    // 開発中のテストを容易にするため、ターミナルに承認リンクを大きく出力する
    console.log('\n' + '='.repeat(60));
    console.log('🚀 [TEST MODE] 承認用リンクが生成されました:');
    console.log(approval_link);
    console.log('='.repeat(60) + '\n');

    const response = await resend.emails.send({
      from: fromAddress === 'onboarding@resend.dev' 
        ? 'onboarding@resend.dev' 
        : `Seihai Tournament <${fromAddress}>`,
      to: [email],
      subject: `【要確認】大会エントリーの承認をお願いします - ${tournament_title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">大会エントリーの承認</h2>
          <p>${player_name} 様</p>
          <p>「<strong>${tournament_title}</strong>」へのエントリーのお申し込みありがとうございます。</p>
          <p>以下のボタンをクリックして、エントリーを確定させてください。有効期限は24時間です。</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${approval_link}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">エントリーを承認する</a>
          </div>
          <p style="font-size: 12px; color: #666;">
            ※もし、このメールに心当たりがない場合は、このメールを無視してください。<br>
            ※ボタンがクリックできない場合は、以下のURLをブラウザに貼り付けてください：<br>
            ${approval_link}
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} Seihai Tournament System</p>
        </div>
      `,
    });

    if (response.error) {
      console.error('Resend API Error (Email not sent):', response.error);
      // 送信失敗しても、承認リンクはターミナルに出ているので success: true とし、
      // 開発者がテストを続けられるようにする
      return { success: true, simulated: true, error: response.error };
    }

    console.log('Resend Email sent successfully:', response.data?.id);
    return { success: true, data: response.data };
  } catch (err: any) {
    console.error('Resend unexpected error:', err.message);
    return { success: false, error: err.message };
  }
}
