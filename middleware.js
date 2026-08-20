// Vercel Edge Middleware：Basic Auth 密碼保護
// 密碼不寫在這裡，從 Vercel 專案的環境變數讀取（Project Settings → Environment Variables）
//   SITE_PASSWORD = 你的密碼（必填）
//   SITE_USER     = 登入帳號（選填，預設 taigi）

export const config = {
  matcher: '/((?!favicon.ico).*)',
};

export default function middleware(request) {
  const validPass = process.env.SITE_PASSWORD;

  // 沒設定密碼就直接放行，避免忘記設定導致整站打不開
  if (!validPass) {
    return;
  }

  const validUser = process.env.SITE_USER || 'taigi';
  const auth = request.headers.get('authorization');

  if (auth && auth.startsWith('Basic ')) {
    const decoded = atob(auth.slice(6));
    const idx = decoded.indexOf(':');
    const user = decoded.slice(0, idx);
    const pass = decoded.slice(idx + 1);
    if (user === validUser && pass === validPass) {
      return; // 驗證通過
    }
  }

  return new Response('請輸入帳號密碼', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
  });
}
