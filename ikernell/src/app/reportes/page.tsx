'use client';

import { useRouter } from 'next/navigation';
import { FaBook, FaCode, FaArrowLeft } from 'react-icons/fa';

export default function BibliotecaPage() {
  const router = useRouter();

  const courses = [
    {
      title: 'Introducción a la Programación en Python',
      description: 'Aprende los fundamentos de Python, incluyendo variables, estructuras de control, funciones y manejo de datos. Ideal para principiantes que desean dominar este lenguaje versátil utilizado en desarrollo web, automatización y análisis de datos.',
      image: '/images/python-course.jpg',
      type: 'Curso',
    },
    {
      title: 'Desarrollo Web con JavaScript y React',
      description: 'Domina el desarrollo de aplicaciones web modernas con JavaScript y React. Este curso cubre componentes, estados, rutas y la creación de interfaces dinámicas e interactivas para proyectos empresariales.',
      image: '/images/react-course.jpg',
      type: 'Curso',
    },
    {
      title: 'Tutorial: Gestión de Proyectos con Spring Boot',
      description: 'Guía práctica para implementar aplicaciones de gestión de proyectos utilizando Spring Boot. Incluye configuración de APIs REST, integración con bases de datos PostgreSQL y mejores prácticas para la arquitectura empresarial.',
      image: '/images/spring-boot-tutorial.jpg',
      type: 'Tutorial',
    },
    {
      title: 'Manual: Herramientas de Gestión Empresarial',
      description: 'Material detallado sobre el uso de herramientas de software para la gestión empresarial, incluyendo sistemas de planificación de recursos (ERP) y herramientas de colaboración como el chat corporativo de IKernell Soluciones Software.',
      image: '/images/erp-manual.jpg',
      type: 'Material',
    },
  ];

  return (
    <div className="container">
      <nav className="nav-bar">
        <div className="nav-container">
          <h1 className="nav-title">Biblioteca de Recursos</h1>
          <button
            onClick={() => router.push('/roles/coordinador')}
            className="nav-button"
          >
            <FaArrowLeft className="icon" />
            Volver al Panel
          </button>
        </div>
      </nav>

      <div className="main-content">
        <div className="card">
          <h2 className="card-title">
            <FaBook className="icon" />
            Cursos y Materiales
          </h2>
          <p className="card-subtitle">
            Explora nuestra colección de cursos y materiales diseñados para mejorar tus habilidades en programación y gestión empresarial.
          </p>
          <div className="resource-grid">
            {courses.map((course, index) => (
              <div key={index} className="resource-card">
                <img
                  src={course.image}
                  alt={course.title}
                  className="resource-image"
                  onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                />
                <div className="resource-content">
                  <h3 className="resource-title">{course.title}</h3>
                  <span className="resource-type">{course.type}</span>
                  <p className="resource-description">{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: 'Arial', sans-serif;
        }

        .nav-bar {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-title {
          color: #333;
          font-size: 24px;
          font-weight: 600;
        }

        .nav-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .card {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.5s ease-in;
        }

        .card-title {
          color: #333;
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-subtitle {
          color: #555;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .resource-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .resource-card {
          background: #f8f8f8;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .resource-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .resource-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-bottom: 1px solid #ddd;
        }

        .resource-content {
          padding: 15px;
        }

        .resource-title {
          color: #333;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .resource-type {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .resource-description {
          color: #555;
          font-size: 14px;
          line-height: 1.5;
        }

        .icon {
          font-size: 14px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .nav-container {
            flex-direction: column;
            gap: 15px;
          }

          .nav-button {
            width: 100%;
            justify-content: center;
          }

          .card {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .resource-grid {
            grid-template-columns: 1fr;
          }

          .card-title {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}