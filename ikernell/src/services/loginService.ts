// src/services/loginService.ts

export async function login(email: string, contrasena: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const endpoint = `${apiUrl}/api/auth/login`;
  const payload = { email, contrasena };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg =
      typeof data === 'string' ? data : data?.error || 'Error de autenticación';
    throw new Error(errorMsg);
  }

  return data;
}
