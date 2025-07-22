'use client'; // Directiva para indicar que es un Client Component en Next.js App Router

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Importa useSearchParams para App Router

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook para obtener parámetros de la URL en App Router
  const [token, setToken] = useState<string | null>(null); // Estado para almacenar el token
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect para obtener el token de la URL una vez que el componente se monta
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      setLoading(false);
    } else {
      setError('Token de restablecimiento no encontrado en la URL.');
      setLoading(false);
    }
  }, [searchParams]); // Dependencia de searchParams para reaccionar a cambios en los parámetros de la URL

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setMessage(''); // Limpia mensajes anteriores
    setError(''); // Limpia errores anteriores

    // Validaciones básicas del lado del cliente
    if (!newPassword || !confirmPassword) {
      setError('Por favor, ingresa y confirma tu nueva contraseña.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!token) {
      setError('Token de restablecimiento inválido o ausente.');
      return;
    }

    try {
      // Realiza la solicitud POST a tu backend de Spring Boot
      // La URL del backend para el restablecimiento de contraseña
      const backendResetPasswordUrl = 'http://localhost:8080/api/trabajadores/reset-password'; 
      
      const response = await fetch(backendResetPasswordUrl, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token, // Envía el token obtenido de la URL
          newPassword: newPassword, // Envía la nueva contraseña
        }),
      });

      if (response.ok) {
        // Si la respuesta es exitosa (código 2xx)
        setMessage('Contraseña restablecida exitosamente. Ahora puedes iniciar sesión.');
        setNewPassword(''); // Limpia los campos del formulario
        setConfirmPassword('');
        // Opcional: Puedes redirigir al usuario a la página de inicio de sesión
        // router.push('/login'); 
      } else {
        // Si la respuesta no es exitosa, intenta leer el mensaje de error del backend
        const errorData = await response.json();
        setError(`Error al restablecer contraseña: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      // Captura errores de red o del servidor
      console.error('Error de red o del servidor:', err);
      setError('No se pudo conectar con el servidor. Por favor, intente de nuevo más tarde.');
    }
  };

  // Muestra un mensaje de carga mientras se obtiene el token
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-700">Cargando...</p>
      </div>
    );
  }

  // Si no hay token o hay un error inicial, muestra el error
  if (error && !token) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.push('/')} // O a tu página de inicio de sesión
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Ir a Inicio
          </button>
        </div>
      </div>
    );
  }

  // Renderiza el formulario de restablecimiento de contraseña
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Restablecer Contraseña</h1>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded-md w-full text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded-md w-full text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Restablecer Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
    