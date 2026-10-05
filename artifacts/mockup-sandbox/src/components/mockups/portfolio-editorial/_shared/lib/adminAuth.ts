export function isAdminLoggedIn(): boolean {
  return false;
}

export async function loginAdmin(_username: string, _password: string): Promise<boolean> { return false; }

export function logoutAdmin(): void {}

export function recordVisit(): void {}
