import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

// Animation/navigation tests use fixtures so they never depend on live services
// or write visitor telemetry to production. Local assets still use real HTTP.
export async function mockServices(context) {
  // Exercise production assets without starting an extra HTTP server.
  if (process.env.PORTFOLIO_BUILD_DIRECTORY) {
    const root = path.resolve(process.env.PORTFOLIO_BUILD_DIRECTORY);
    await context.route('http://localhost:4173/**', async route => {
      const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
      let file = path.resolve(root, '.' + pathname);
      if (!file.startsWith(root + path.sep) && file !== root) return route.abort();
      if (!path.extname(file)) file = path.join(root, 'index.html');
      try {
        if (!(await stat(file)).isFile()) return route.fulfill({ status: 404, body: 'Not found' });
        const types = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.pdf':'application/pdf', '.woff2':'font/woff2' };
        return route.fulfill({ body: await readFile(file), contentType: types[path.extname(file)] ?? 'application/octet-stream' });
      } catch { return route.fulfill({ status: 404, body: 'Not found' }); }
    });
  }
  await context.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '/* System-font layout under test. */' }));
  await context.route('https://api.github.com/users/Reyhan-irza**', (route) => {
    const isRepos = new URL(route.request().url()).pathname.endsWith('/repos');
    return route.fulfill({ json: isRepos ? [] : { public_repos: 3, followers: 0, following: 0 } });
  });
  await context.route(/^https:\/\/[^/]+\.supabase\.co\/rest\/v1\//, (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/portfolio_rating_summary')) {
      return route.fulfill({ json: { rating_count: 0, average_rating: 0,
        one_star_count: 0, two_star_count: 0, three_star_count: 0,
        four_star_count: 0, five_star_count: 0 } });
    }
    if (route.request().method() === 'POST') return route.fulfill({ status: 201, body: '' });
    return route.fulfill({ json: [], headers: { 'content-range': '*/0' } });
  });
}
