'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTasks, FaBug, FaPauseCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';

// Importaciones de servicios
import { Activity, getActivitiesByDeveloperId, updateActivityStatus } from '@/services/ActivityService';
import { Project } from '@/services/ProjectService';
import { Etapa } from '@/services/EtapaService';
import { getDevelopers } from '@/services/CoorService';

// Importar modales
import RegisterErrorModal from '@/components/RegisterErrorModal';
import RegisterInterruptionModal from '@/components/RegisterInterruptionModal';

// Extender la interfaz de Actividad para incluir Project y Etapa completos
interface ActivityWithDetails extends Activity {
  // Estos ya deberían venir anidados si tu backend está configurado para ello.
}

export default function DeveloperPage() {
  const [activities, setActivities] = useState<ActivityWithDetails[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [showRegisterErrorModal, setShowRegisterErrorModal] = useState(false);
  const [showRegisterInterruptionModal, setShowRegisterInterruptionModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    setLoadingActivities(true);
    try {
      // 1. Obtener todos los trabajadores con el rol de 'Desarrollador'
      const developers = await getDevelopers();
      console.log('Desarrolladores obtenidos:', developers); // Log para depurar

      let allActivities: ActivityWithDetails[] = [];

      if (developers.length > 0) {
        // 2. Para cada desarrollador, obtener sus actividades asignadas
        const activitiesPromises = developers.map(async (dev) => {
          try {
            // Validar que idTrabajador sea un número válido
            if (!dev.idTrabajador || isNaN(dev.idTrabajador) || typeof dev.idTrabajador !== 'number') {
              console.error(`ID de trabajador no válido para el desarrollador:`, dev);
              return []; // Retorna un array vacío si el ID no es válido
            }
            const devActivities = await getActivitiesByDeveloperId(dev.idTrabajador);
            return devActivities;
          } catch (error) {
            console.error(`Error al obtener actividades para el desarrollador ID ${dev.idTrabajador || 'desconocido'}:`, error);
            return []; // Retorna un array vacío si hay un error
          }
        });

        // 3. Esperar a que todas las promesas se resuelvan y combinar los resultados
        const results = await Promise.all(activitiesPromises);
        allActivities = results.flat();
      } else {
        console.warn('No se encontraron trabajadores con el rol "Desarrollador".');
      }

      setActivities(allActivities);
    } catch (error) {
      console.error('Error al obtener todas las actividades de desarrolladores:', error);
      alert('Hubo un error al cargar las actividades. Por favor, intente de nuevo más tarde.');
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleUpdateActivityStatus = async (activity: Activity, newStatus: 'en_curso' | 'completada') => {
    try {
      await updateActivityStatus(activity.idActividad, newStatus);
      cargarActividades(); // Recargar actividades para ver el cambio
    } catch (error) {
      console.error(`Error al actualizar el estado de la actividad ${activity.idActividad}:`, error);
      alert('Error al actualizar el estado de la actividad. Consulta la consola.');
    }
  };

  const handleNavigation = (path: string) => {
    if (path === '/registrar-error') {
      setShowRegisterErrorModal(true);
    } else if (path === '/registrar-interrupcion') {
      setShowRegisterInterruptionModal(true);
    } else if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      router.push(path);
    }
  };

  const handleErrorRegistered = () => {
    setShowRegisterErrorModal(false);
  };

  const handleInterruptionRegistered = () => {
    setShowRegisterInterruptionModal(false);
  };

  return (
    <div className="container">
      <nav className="nav-bar">
        <div className="nav-container">
          <h1 className="nav-title">Panel del Desarrollador</h1>
          <div className="nav-buttons">
            <button
              onClick={() => handleNavigation('/registrar-error')}
              className="nav-button"
            >
              <FaBug className="icon" />
              Registrar Error
            </button>
            <button
              onClick={() => handleNavigation('/registrar-interrupcion')}
              className="nav-button"
            >
              <FaPauseCircle className="icon" />
              Registrar Interrupción
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="card">
          <h2 className="card-title">
            <FaTasks className="icon" />
            Actividades de Desarrolladores
          </h2>
          <div className="table-container">
            {loadingActivities ? (
              <p className="text-center text-gray-600 flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Cargando actividades...
              </p>
            ) : activities.length > 0 ? (
              <table className="table">
                <thead>
                  <tr className="table-header">
                    <th>Actividad</th>
                    <th>Descripción</th>
                    <th>Proyecto</th>
                    <th>Etapa</th>
                    <th>Desarrollador</th>
                    <th>Fechas Estimadas</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity: ActivityWithDetails) => (
                    <tr key={activity.idActividad} className="table-row">
                      <td>{activity.nombre}</td>
                      <td>{activity.descripcion || 'N/A'}</td>
                      <td>{activity.etapa?.proyecto?.nombre || 'N/A'}</td>
                      <td>{activity.etapa?.nombre || 'N/A'}</td>
                      <td>{activity.desarrollador ? `${activity.desarrollador.nombre} ${activity.desarrollador.apellido}` : 'N/A'}</td>
                      <td>{activity.fechaInicioEstimada} - {activity.fechaFinEstimada || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${activity.estado}`}>
                          {activity.estado.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        {activity.estado !== 'completada' && (
                          <div className="flex gap-2">
                            {activity.estado !== 'en_curso' && (
                              <button
                                onClick={() => handleUpdateActivityStatus(activity, 'en_curso')}
                                className="action-button-icon-small text-blue-500 hover:text-blue-700"
                                title="Marcar En Curso"
                              >
                                <FaSpinner className="text-sm" />
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateActivityStatus(activity, 'completada')}
                              className="action-button-icon-small text-green-500 hover:text-green-700"
                              title="Marcar Completada"
                            >
                              <FaCheckCircle />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No hay actividades asignadas para mostrar.</p>
            )}
          </div>
        </div>
      </div>

      <RegisterErrorModal
        isOpen={showRegisterErrorModal}
        onClose={() => setShowRegisterErrorModal(false)}
        onErrorRegistered={handleErrorRegistered}
      />
      <RegisterInterruptionModal
        isOpen={showRegisterInterruptionModal}
        onClose={() => setShowRegisterInterruptionModal(false)}
        onInterruptionRegistered={handleInterruptionRegistered}
      />

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
          padding: 20px;
          font-family: 'Inter', sans-serif;
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
          color: #222;
          font-size: 24px;
          font-weight: 700;
        }

        .nav-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .nav-button {
          background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(33, 150, 243, 0.3);
        }

        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(33, 150, 243, 0.4);
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .card {
          background: white;
          border-radius: 10px;
          padding: 30px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.5s ease-in;
        }

        .card-title {
          color: #222;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .table-container {
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .table-header {
          background: #f0f0f0;
          color: #222;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .table-header th {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ccc;
        }

        .table-row {
          transition: background 0.3s;
        }

        .table-row:hover {
          background: #f8f8f8;
        }

        .table-row td {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
          color: #333;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        .status-badge.por_hacer { background: #6c757d; }
        .status-badge.en_curso { background: #ffc107; color: #333; }
        .status-badge.completada { background: #28a745; }
        .status-badge.bloqueada { background: #6f42c1; }
        .status-badge.atrasada { background: #dc3545; }

        .action-button-icon-small {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .action-button-icon-small:hover {
          opacity: 0.8;
        }

        .no-data {
          padding: 20px;
          text-align: center;
          color: #555;
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

          .nav-buttons {
            flex-direction: column;
            width: 100%;
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
          .card-title {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}