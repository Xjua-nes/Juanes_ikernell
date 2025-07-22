"use client";

import React, { useState } from "react";

export default function Home() {
  const [backgroundStyle] = useState({
    backgroundImage: "linear-gradient(135deg, #28004f, #4a0080)", // Degradado fijo morado
  });

  return (
    <div className="min-h-screen relative overflow-hidden font-['Montserrat']">
      {/* Enlace a las fuentes de Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&family=Oswald:wght@200..700&family=Vollkorn+SC:wght@400;600;700;900&display=swap" rel="stylesheet" />
      {/* Enlace al CSS de Bootstrap Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>

      {/* Estilos para la animación del degradado */}
      <style jsx>{`
        .animated-gradient-background {
          background-size: 400% 400%;
        }
      `}</style>
      <div className="absolute inset-0 animated-gradient-background" style={backgroundStyle}></div>

      {/* Contenido de la página */}
      <div className="relative z-10 text-gray-100">
        {/* Barra de Navegación */}
        <nav className="bg-purple-950 bg-opacity-30 shadow-sm py-4 sticky top-0 z-50 backdrop-blur-sm">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <a href="/">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-['Vollkorn SC'] tracking-wider">
                IKernell
              </h1>
            </a>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#about" className="text-gray-100 hover:text-blue-300 transition-colors">Nosotros</a>
              <a href="#services" className="text-gray-100 hover:text-blue-300 transition-colors">Servicios</a>
              <a href="#projects" className="text-gray-100 hover:text-blue-300 transition-colors">Proyectos</a>
              <a href="#news" className="text-gray-100 hover:text-blue-300 transition-colors">Noticias</a>
              <a href="#faq" className="text-gray-100 hover:text-blue-300 transition-colors">FAQ</a>
              <a href="#contact" className="text-gray-100 hover:text-blue-300 transition-colors">Contacto</a>
              <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">Iniciar Sesión</a>
            </div>
            {/* Botón de menú móvil */}
            <button className="md:hidden text-gray-100">
              <i className="bi bi-list w-6 h-6"></i>
            </button>
          </div>
        </nav>

        {/* Sección Principal (Hero) */}
        <section className="py-16 lg:py-24 text-center">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <i className="bi bi-rocket-takeoff text-blue-300 text-3xl mb-6"></i>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-['Oswald']">
              Bienvenidos a IKernell Soluciones Software
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              Soluciones de software innovadoras para optimizar los procesos de tu empresa y acelerar tu transformación digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105">
                Contáctanos
              </a>
              <a href="#projects" className="border-2 border-blue-600 text-blue-300 px-8 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                Ver Proyectos
              </a>
            </div>
          </div>
        </section>

        {/* Sección de Estadísticas */}
        <section className="py-16 rounded-lg mx-auto max-w-7xl mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <i className="bi bi-people text-blue-300 text-2xl mb-4"></i>
                <h3 className="text-3xl font-bold text-white font-['Oswald']">150+</h3>
                <p className="text-gray-300">Clientes Satisfechos</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <i className="bi bi-code-slash text-blue-300 text-2xl mb-4"></i>
                <h3 className="text-3xl font-bold text-white font-['Oswald']">250+</h3>
                <p className="text-gray-300">Proyectos Completados</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <i className="bi bi-clock text-blue-300 text-2xl mb-4"></i>
                <h3 className="text-3xl font-bold text-white font-['Oswald']">5+</h3>
                <p className="text-gray-300">Años de Experiencia</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <i className="bi bi-award text-blue-300 text-2xl mb-4"></i>
                <h3 className="text-3xl font-bold text-white font-['Oswald']">98%</h3>
                <p className="text-gray-300">Tasa de Éxito</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección "Acerca de Nosotros" */}
        <section id="about" className="py-16 rounded-lg mx-auto max-w-7xl mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <i className="bi bi-building text-blue-300 text-3xl mb-4"></i>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-['Oswald']">Acerca de Nosotros</h2>
              <p className="text-lg md:text-xl max-w-4xl mx-auto text-gray-200">
                IKernell Soluciones Software es una empresa líder en tecnología dedicada a brindar soluciones de software de vanguardia. 
                Nuestra misión es mejorar la eficiencia empresarial a través de la automatización y proporcionar servicios de primer nivel a nuestros clientes en diversas industrias.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-purple-900 bg-opacity-30 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <i className="bi bi-lightbulb text-blue-300 text-2xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Innovación</h3>
                <p className="text-gray-300">Soluciones tecnológicas de vanguardia que impulsan el crecimiento empresarial</p>
              </div>
              <div className="text-center p-6 bg-purple-900 bg-opacity-30 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <i className="bi bi-people text-blue-300 text-2xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Colaboración</h3>
                <p className="text-gray-300">Trabajamos de cerca con nuestros clientes para entender sus necesidades únicas</p>
              </div>
              <div className="text-center p-6 bg-purple-900 bg-opacity-30 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <i className="bi bi-award text-blue-300 text-2xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Excelencia</h3>
                <p className="text-gray-300">Entregamos soluciones de alta calidad con resultados excepcionales</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Servicios */}
        <section id="services" className="py-16 rounded-lg mx-auto max-w-7xl mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <i className="bi bi-gear text-blue-300 text-4xl mb-4"></i>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-['Oswald']">Nuestros Servicios</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-200">
                Ofrecemos soluciones de software integrales adaptadas a las necesidades de tu negocio
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-purple-900 bg-opacity-30 p-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <i className="bi bi-list-task text-blue-300 text-4xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-4 text-white font-['Oswald']">Gestión de Proyectos</h3>
                <p className="text-gray-300">Herramientas completas para la coordinación de proyectos, asignación de desarrolladores y seguimiento del progreso con actualizaciones en tiempo real.</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <i className="bi bi-bar-chart text-blue-300 text-4xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-4 text-white font-['Oswald']">Análisis e Informes</h3>
                <p className="text-gray-300">Informes detallados y análisis sobre el rendimiento del proyecto, la productividad del equipo y las perspectivas del negocio.</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <i className="bi bi-person-add text-blue-300 text-4xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-4 text-white font-['Oswald']">Gestión de Equipos</h3>
                <p className="text-gray-300">Registro y gestión eficiente de equipos de desarrollo con seguimiento de habilidades y asignación de recursos.</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <i className="bi bi-phone text-blue-300 text-4xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-4 text-white font-['Oswald']">Desarrollo Móvil</h3>
                <p className="text-gray-300">Aplicaciones móviles nativas y multiplataforma para iOS y Android con diseño UI/UX moderno.</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <i className="bi bi-globe text-blue-300 text-4xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-4 text-white font-['Oswald']">Desarrollo Web</h3>
                <p className="text-gray-300">Aplicaciones web modernas utilizando tecnologías de vanguardia como React, Next.js y Node.js.</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-8 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <i className="bi bi-building text-blue-300 text-4xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-4 text-white font-['Oswald']">Soluciones Empresariales</h3>
                <p className="text-gray-300">Soluciones de software empresarial escalables diseñadas para manejar procesos y flujos de trabajo complejos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Proyectos */}
        <section id="projects" className="py-16 rounded-lg mx-auto max-w-7xl mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <i className="bi bi-rocket text-blue-300 text-4xl mb-4"></i>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-['Oswald']">Nuestros Proyectos</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-200">
                Explora algunos de nuestros proyectos exitosos en diferentes industrias
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <img src="https://placehold.co/300x200/007bff/ffffff?text=E-Commerce" alt="Imagen de Plataforma de E-Commerce" className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Plataforma de E-Commerce</h3>
                <p className="text-gray-300 mb-4">Solución completa de tienda en línea con gestión de inventario, procesamiento de pagos y panel de análisis.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">React</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Node.js</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">MongoDB</span>
                </div>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{animationDelay: '0.1s'}}>
                <img src="https://placehold.co/300x200/28a745/ffffff?text=Healthcare" alt="Imagen de Gestión Hospitalaria" className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Gestión Hospitalaria</h3>
                <p className="text-gray-300 mb-4">Sistema integral de gestión hospitalaria con registros de pacientes, programación de citas y facturación.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Vue.js</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Python</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">PostgreSQL</span>
                </div>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{animationDelay: '0.2s'}}>
                <img src="https://placehold.co/300x200/6f42c1/ffffff?text=LMS" alt="Imagen de Sistema de Gestión de Aprendizaje" className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Sistema de Gestión de Aprendizaje (LMS)</h3>
                <p className="text-gray-300 mb-4">Plataforma de educación en línea con gestión de cursos, seguimiento de estudiantes y evaluaciones interactivas.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Angular</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Laravel</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">MySQL</span>
                </div>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{animationDelay: '0.3s'}}>
                <img src="https://placehold.co/300x200/fd7e14/ffffff?text=Restaurant+POS" alt="Imagen de Sistema POS para Restaurantes" className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Sistema POS para Restaurantes</h3>
                <p className="text-gray-300 mb-4">Sistema de punto de venta para restaurantes con gestión de pedidos, seguimiento de inventario y análisis de clientes.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">Flutter</span>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">Firebase</span>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">Stripe</span>
                </div>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{animationDelay: '0.4s'}}>
                <img src="https://placehold.co/300x200/dc3545/ffffff?text=Manufacturing+ERP" alt="Imagen de ERP para Manufactura" className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">ERP para Manufactura</h3>
                <p className="text-gray-300 mb-4">Sistema de planificación de recursos empresariales para empresas de manufactura con gestión de la cadena de suministro.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Java</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Spring Boot</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Oracle</span>
                </div>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105" style={{animationDelay: '0.5s'}}>
                <img src="https://placehold.co/300x200/20c997/ffffff?text=Fitness+App" alt="Imagen de Aplicación Móvil de Fitness" className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Aplicación Móvil de Fitness</h3>
                <p className="text-gray-300 mb-4">Aplicación móvil para seguimiento de fitness con planes de entrenamiento, guías de nutrición y funciones sociales.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm">React Native</span>
                  <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm">GraphQL</span>
                  <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm">AWS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Noticias */}
        <section id="news" className="py-16 rounded-lg mx-auto max-w-7xl mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <i className="bi bi-newspaper text-blue-300 text-4xl mb-4"></i>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-['Oswald']">Últimas Noticias</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-200">
                Mantente al día con nuestros últimos desarrollos y conocimientos de la industria
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm inline-block mb-4">Tecnología</div>
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Nuevas Funciones de Integración de IA</h3>
                <p className="text-gray-300 mb-4">Descubre nuestras últimas funciones impulsadas por IA que mejoran la eficiencia y automatización de la gestión de proyectos.</p>
                <a href="#" className="text-blue-300 hover:underline font-medium">Leer Más →</a>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm inline-block mb-4">Industria</div>
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Tendencias de Desarrollo de Software 2025</h3>
                <p className="text-gray-300 mb-4">Mantente al día con las últimas tendencias en desarrollo de software y tecnologías emergentes.</p>
                <a href="#" className="text-blue-300 hover:underline font-medium">Leer Más →</a>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm inline-block mb-4">Empresa</div>
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">IKernell Gana Premio a la Innovación Tecnológica</h3>
                <p className="text-gray-300 mb-4">Estamos orgullosos de anunciar nuestro reconocimiento por la destacada innovación en soluciones de software empresarial.</p>
                <a href="#" className="text-blue-300 hover:underline font-medium">Leer Más →</a>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Preguntas Frecuentes (FAQ) */}
        <section id="faq" className="py-16 rounded-lg mx-auto max-w-7xl mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <i className="bi bi-question-circle text-blue-300 text-4xl mb-4"></i>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-['Oswald']">Preguntas Frecuentes</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-200">
                Encuentra respuestas a preguntas comunes sobre nuestros servicios y soluciones
              </p>
            </div>
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-3 text-white font-['Oswald']">¿Qué servicios ofrece IKernell?</h3>
                <p className="text-gray-300">Ofrecemos servicios integrales de desarrollo de software, incluyendo desarrollo web, aplicaciones móviles, soluciones empresariales, herramientas de gestión de proyectos y desarrollo de software personalizado adaptado a las necesidades de tu negocio.</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-3 text-white font-['Oswald']">¿Cuánto tiempo tarda un proyecto típico?</h3>
                <p className="text-gray-300">Los plazos de los proyectos varían según la complejidad y el alcance. Los proyectos sencillos pueden tardar de 2 a 4 semanas, mientras que las soluciones empresariales complejas pueden tardar de 3 a 6 meses. Proporcionamos plazos detallados durante la fase de planificación.</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-3 text-white font-['Oswald']">¿Ofrecen soporte y mantenimiento continuos?</h3>
                <p className="text-gray-300">Sí, ofrecemos paquetes completos de soporte y mantenimiento para asegurar que tu software siga funcionando de manera óptima. Esto incluye corrección de errores, actualizaciones y soporte técnico.</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-3 text-white font-['Oswald']">¿Cómo puedo contactar al soporte?</h3>
                <p className="text-gray-300">Puedes comunicarte con nuestro equipo de soporte a través de múltiples canales: envíanos un correo electrónico a support@ikernell.com, llámanos al +57 300 123 4567, o utiliza nuestra información de contacto a continuación.</p>
              </div>
              <div className="bg-purple-900 bg-opacity-30 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-3 text-white font-['Oswald']">¿Con qué tecnologías trabajan?</h3>
                <p className="text-gray-300">Trabajamos con tecnologías modernas incluyendo React, Next.js, Node.js, Python, Java, frameworks móviles como React Native y Flutter, y plataformas en la nube como AWS y Azure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Contacto */}
        <section id="contact" className="py-16 rounded-lg mx-auto max-w-7xl mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <i className="bi bi-envelope text-blue-300 text-4xl mb-4"></i>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white font-['Oswald']">Ponte en Contacto</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-200">
                ¿Listo para comenzar tu próximo proyecto? Contáctanos hoy para una consulta gratuita
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center p-8 bg-purple-900 bg-opacity-30 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <i className="bi bi-telephone text-blue-300 text-3xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Teléfono</h3>
                <p className="text-gray-300">+57 300 123 4567</p>
                <p className="text-gray-300">+57 1 234 5678</p>
              </div>
              <div className="text-center p-8 bg-purple-900 bg-opacity-30 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <i className="bi bi-envelope text-blue-300 text-3xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Correo Electrónico</h3>
                <p className="text-gray-300">support@ikernell.com</p>
                <p className="text-gray-300">info@ikernell.com</p>
              </div>
              <div className="text-center p-8 bg-purple-900 bg-opacity-30 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <i className="bi bi-geo-alt text-blue-300 text-3xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-2 text-white font-['Oswald']">Ubicación</h3>
                <p className="text-gray-300">Bogotá, Colombia</p>
                <p className="text-gray-300">Disponible en todo el mundo</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pie de Página */}
        <footer className="py-12 bg-gray-900 bg-opacity-50 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 font-['Oswald']">
                  <i className="bi bi-building mr-2"></i>
                  IKernell
                </h3>
                <p className="text-gray-300 mb-4">
                  Soluciones de software innovadoras para negocios modernos. Transformamos ideas en potentes experiencias digitales.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 font-['Oswald']">
                  <i className="bi bi-link-45deg mr-2"></i>
                  Enlaces Rápidos
                </h3>
                <ul className="space-y-2">
                  <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">Acerca de Nosotros</a></li>
                  <li><a href="#services" className="text-gray-300 hover:text-white transition-colors">Servicios</a></li>
                  <li><a href="#projects" className="text-gray-300 hover:text-white transition-colors">Proyectos</a></li>
                  <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 font-['Oswald']">Tecnologías</h3>
                <ul className="space-y-2">
                  <li><a href="https://nextjs.org" className="text-gray-300 hover:text-white transition-colors">Next.js</a></li>
                  <li><a href="https://reactjs.org" className="text-gray-300 hover:text-white transition-colors">React</a></li>
                  <li><a href="https://nodejs.org" className="text-gray-300 hover:text-white transition-colors">Node.js</a></li>
                  <li><a href="https://vercel.com" className="text-gray-300 hover:text-white transition-colors">Vercel</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 font-['Oswald']">Información de Contacto</h3>
                <div className="space-y-2 text-gray-300">
                  <p><i className="bi bi-envelope mr-2"></i>support@ikernell.com</p>
                  <p><i className="bi bi-telephone mr-2"></i>+57 300 123 4567</p>
                  <p><i className="bi bi-geo-alt mr-2"></i>Bogotá, Colombia</p>
                </div>
                <div className="mt-4 flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    <i className="bi bi-facebook"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-300">© 2025 IKernell Soluciones Software. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}