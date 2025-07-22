'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPaperPlane, FaEnvelope, FaLock, FaShieldAlt, FaUserCircle, FaArrowLeft } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contrasena: password }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Credenciales incorrectas')
      }

      const data = await response.json()
      
      // Gd dt
localStorage.setItem('rol', data.rol.nombre)
localStorage.setItem('id_rol', data.rol.idRol)

      localStorage.setItem('id_trabajador', data.id_trabajador)
      localStorage.setItem('email', data.email)

      
const idRol = Number(data.rol.idRol)

switch(idRol) {
  case 1:
    router.push('/roles/coordinador')
    break
  case 2:
    router.push('/roles/lider')
    break
  case 3:
    router.push('/roles/desarrollador')
    break
  default:
    router.push('/dashboard')
}

      
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <button 
        onClick={() => router.push('/')} 
        className="back-button"
      >
        <FaArrowLeft className="back-icon" />
        Volver al inicio
      </button>

      <div className="login-card">
        <div className="login-header">
          <FaUserCircle className="user-icon" />
          <h1>Bienvenido</h1>
          <p className="subtitle">Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            <FaPaperPlane className="button-icon" />
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="login-footer">
          <FaShieldAlt className="shield-icon" />
          <span>Conexión segura y protegida</span>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          position: relative;
          font-family: 'Arial', sans-serif;
        }

        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          padding: 8px 15px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          color: #333;
          font-weight: 500;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: white;
          transform: translateX(-3px);
        }

        .back-icon {
          font-size: 14px;
        }

        .login-card {
          background: white;
          border-radius: 10px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .user-icon {
          font-size: 50px;
          color: #667eea;
          margin-bottom: 15px;
        }

        h1 {
          color: #333;
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }

        .subtitle {
          color: #555;
          margin: 5px 0 0;
          font-size: 14px;
        }

        .error-message {
          color: #e74c3c;
          background: #fdecea;
          padding: 10px 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #333;
          font-weight: 500;
          font-size: 14px;
        }

        .input-icon {
          color: #667eea;
          font-size: 16px;
        }

        input {
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s;
          color: #222;
        }

        input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .login-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          margin-top: 10px;
          font-size: 15px;
        }

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
        }

        .button-icon {
          font-size: 14px;
        }

        .login-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 30px;
          color: #555;
          font-size: 12px;
        }

        .shield-icon {
          color: #2ecc71;
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
          }
          
          .back-button {
            top: 15px;
            left: 15px;
            padding: 6px 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}