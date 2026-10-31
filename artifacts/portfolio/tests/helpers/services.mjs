// Animation/navigation tests use fixtures so they never depend on live services
// or write visitor telemetry to production. Local assets still use real HTTP.
export async function mockServices(context) {
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
