'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBook, FaUserPlus, FaTasks, FaClipboardList, FaProjectDiagram, FaAngleDown, FaAngleUp, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';

// Importaciones de servicios individuales
import { Project, getAllProjects } from '@/services/ProjectService';
import { Etapa, getEtapasByProjectId } from '@/services/EtapaService';
import { Activity, getActivitiesByEtapaId } from '@/services/ActivityService';
import { Asignacion, getAsignacionesByProjectId } from '@/services/AsignacionService';
import React from 'react';

// Componentes de modales
import AssignDeveloperModal from '@/components/AssignDeveloperModal';
import RegisterEtapaModal from '@/components/RegisterEtapaModal';
import RegisterActivityModal from '@/components/RegisterActivityModal';
import ChangeProjectStatusModal from '@/components/ChangeProjectStatusModal';

// Extender interfaces para incluir datos anidados del backend
interface ProjectWithDetails extends Project {
  etapas?: (Etapa & { actividades?: Activity[] })[];
  asignaciones?: Asignacion[];
}

export default function LiderPage() {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const [expandedEtapas, setExpandedEtapas] = useState<Set<number>>(new Set());
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showAssignDeveloperModal, setShowAssignDeveloperModal] = useState(false);
  const [showRegisterEtapaModal, setShowRegisterEtapaModal] = useState(false);
  const [showRegisterActivityModal, setShowRegisterActivityModal] = useState(false);
  const [showChangeProjectStatusModal, setShowChangeProjectStatusModal] = useState(false);
  const [selectedProjectForStatusChange, setSelectedProjectForStatusChange] = useState<Project | null>(null);

  const router = useRouter();

  useEffect(() => {
    cargarProyectos();
  }, []);

  const cargarProyectos = async () => {
    setLoadingProjects(true);
    try {
      const allProjects = await getAllProjects();
      const projectsWithDetails = await Promise.all(allProjects.map(async (project) => {
        const etapas = await getEtapasByProjectId(project.idProyecto);
        const etapasWithActivities = await Promise.all(etapas.map(async (etapa) => {
          const actividades = await getActivitiesByEtapaId(etapa.idEtapa);
          return { ...etapa, actividades };
        }));

        const asignaciones = await getAsignacionesByProjectId(project.idProyecto);
        return { ...project, etapas: etapasWithActivities, asignaciones };
      }));
      setProjects(projectsWithDetails);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleNavigation = (path: string) => {
    if (path === '/asignar-desarrollador') {
      setShowAssignDeveloperModal(true);
    } else if (path === '/registrar-etapa') {
      setShowRegisterEtapaModal(true);
    } else if (path === '/registrar-actividad') {
      setShowRegisterActivityModal(true);
    } else if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      router.push(path);
    }
  };

  const handleAssignmentCreated = () => {
    setShowAssignDeveloperModal(false);
    cargarProyectos();
  };

  const handleEtapaCreated = () => {
    setShowRegisterEtapaModal(false);
    cargarProyectos();
  };

  const handleActivityRegistered = () => {
    setShowRegisterActivityModal(false);
    cargarProyectos();
  };

  const handleChangeProjectStatus = (project: Project) => {
    setSelectedProjectForStatusChange(project);
    setShowChangeProjectStatusModal(true);
  };

  const handleProjectStatusChanged = () => {
    setShowChangeProjectStatusModal(false);
    cargarProyectos();
  };

  const toggleProjectExpansion = (projectId: number) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const toggleEtapaExpansion = (etapaId: number) => {
    setExpandedEtapas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(etapaId)) {
        newSet.delete(etapaId);
      } else {
        newSet.add(etapaId);
      }
      return newSet;
    });
  };

  return (
    <div className="container">
      <nav className="nav-bar">
        <div className="nav-container">
          <h1 className="nav-title">Panel del Líder de Proyectos</h1>
          <div className="nav-buttons">
            <button
              onClick={() => handleNavigation('/recursos')}
              className="nav-button"
            >
              <FaBook className="icon" />
              Recursos
            </button>
            <button
              onClick={() => handleNavigation('/asignar-desarrollador')}
              className="nav-button"
            >
              <FaUserPlus className="icon" />
              Asignar Desarrollador
            </button>
            <button
              onClick={() => handleNavigation('/registrar-etapa')}
              className="nav-button"
            >
              <FaTasks className="icon" />
              Registrar Etapa
            </button>
            <button
              onClick={() => handleNavigation('/registrar-actividad')}
              className="nav-button"
            >
              <FaClipboardList className="icon" />
              Registrar Actividad
            </button>
            <button
              onClick={() => handleNavigation('https://chat.whatsapp.com/FtFnbRsvmqhJiGwsILClQt?mode=r_c')}
              className="nav-button"
            >
              <FaWhatsapp className="icon" />
              Chat
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="card">
          <h2 className="card-title">
            <FaProjectDiagram className="icon" />
            Todos los Proyectos (Vista de Líder)
          </h2>
          <div className="table-container">
            {loadingProjects ? (
              <p className="text-center text-gray-600">Cargando proyectos...</p>
            ) : projects.length > 0 ? (
              <table className="table">
                <thead>
                  <tr className="table-header">
                    <th>Proyecto</th>
                    <th>Descripción</th>
                    <th>Fechas</th>
                    <th>Líder</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                    <th>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p: ProjectWithDetails) => (
                    <React.Fragment key={p.idProyecto}>
                      <tr className="table-row project-row">
                        <td>{p.nombre}</td>
                        <td>{p.descripcion || 'N/A'}</td>
                        <td>{p.fechaInicio} - {p.fechaFinEstimada || 'N/A'}</td>
                        <td>{p.lider ? `${p.lider.nombre} ${p.lider.apellido}` : 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${p.estado}`}>
                            {p.estado.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleChangeProjectStatus(p)}
                            className="action-button-icon-small"
                            title="Cambiar Estado del Proyecto"
                          >
                            <FaCheckCircle />
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => toggleProjectExpansion(p.idProyecto)}
                            className="action-button-icon"
                            title={expandedProjects.has(p.idProyecto) ? "Contraer" : "Expandir"}
                          >
                            {expandedProjects.has(p.idProyecto) ? <FaAngleUp /> : <FaAngleDown />}
                          </button>
                        </td>
                      </tr>
                      {expandedProjects.has(p.idProyecto) && (
                        <tr className="expanded-content-row">
                          <td colSpan={7}>
                            <div className="nested-table-container">
                              {/* Sección de Desarrolladores Asignados */}
                              <h3 className="nested-title">Desarrolladores Asignados:</h3>
                              {p.asignaciones && p.asignaciones.length > 0 ? (
                                <table className="nested-table">
                                  <thead>
                                    <tr>
                                      <th>Desarrollador</th>
                                      <th>Fecha Asignación</th>
                                      <th>Activo</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {p.asignaciones.map((asignacion) => (
                                      <tr key={asignacion.idAsignacion} className="nested-table-row">
                                        <td>{asignacion.desarrollador ? `${asignacion.desarrollador.nombre} ${asignacion.desarrollador.apellido}` : 'N/A'}</td>
                                        <td>{asignacion.fechaAsignacion}</td>
                                        <td>{asignacion.activo ? 'Sí' : 'No'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="no-data-nested">No hay desarrolladores asignados a este proyecto.</p>
                              )}

                              {/* Sección de Etapas y Actividades */}
                              <h3 className="nested-title mt-4">Etapas del Proyecto: {p.nombre}</h3>
                              {p.etapas && p.etapas.length > 0 ? (
                               	<table className="nested-table">
                                  <thead>
                                    <tr>
                                      <th>Etapa</th>
                                      <th>Fechas Estimadas</th>
                                      <th>Estado</th>
                                      <th>Detalles</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {p.etapas.map((e: Etapa & { actividades?: Activity[] }) => (
                                      <React.Fragment key={e.idEtapa}>
                                        <tr className="nested-table-row etapa-row">
                                          <td>{e.nombre}</td>
                                          <td>{e.fechaInicioEstimada} - {e.fechaFinEstimada || 'N/A'}</td>
                                          <td>
                                            <span className={`status-badge ${e.estado}`}>
                                              {e.estado.replace(/_/g, ' ')}
                                            </span>
                                          </td>
                                          <td>
                                            <button
                                              onClick={() => toggleEtapaExpansion(e.idEtapa)}
                                              className="action-button-icon"
                                              title={expandedEtapas.has(e.idEtapa) ? "Contraer" : "Expandir"}
                                            >
                                              {expandedEtapas.has(e.idEtapa) ? <FaAngleUp /> : <FaAngleDown />}
                                            </button>
                                          </td>
                                        </tr>
                                        {expandedEtapas.has(e.idEtapa) && (
                                          <tr className="expanded-content-row">
                                            <td colSpan={4}>
                                              <div className="nested-table-container">
                                                <h4 className="nested-title-small">Actividades de la Etapa: {e.nombre}</h4>
                                                {e.actividades && e.actividades.length > 0 ? (
                                                  <table className="nested-table">
                                                    <thead>
                                                      <tr>
                                                        <th>Actividad</th>
                                                        <th>Descripción</th>
                                                        <th>Desarrollador</th>
                                                        <th>Fechas Estimadas</th>
                                                        <th>Estado</th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {e.actividades.map((a: Activity) => (
                                                        <tr key={a.idActividad} className="nested-table-row">
                                                          <td>{a.nombre}</td>
                                                          <td>{a.descripcion || 'N/A'}</td>
                                                          <td>{a.desarrollador ? `${a.desarrollador.nombre} ${a.desarrollador.apellido}` : 'N/A'}</td>
                                                          <td>{a.fechaInicioEstimada} - {a.fechaFinEstimada || 'N/A'}</td>
                                                          <td>
                                                            <span className={`status-badge ${a.estado}`}>
                                                              {a.estado.replace(/_/g, ' ')}
                                                            </span>
                                                          </td>
                                                        </tr>
                                                      ))}
                                                    </tbody>
                                                  </table>
                                                ) : (
                                                  <p className="no-data-nested">No hay actividades registradas para esta etapa.</p>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="no-data-nested">No hay etapas registradas para este proyecto.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No hay proyectos para mostrar en el sistema.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <AssignDeveloperModal
        isOpen={showAssignDeveloperModal}
        onClose={() => setShowAssignDeveloperModal(false)}
        onAssignmentCreated={handleAssignmentCreated}
      />
      <RegisterEtapaModal
        isOpen={showRegisterEtapaModal}
        onClose={() => setShowRegisterEtapaModal(false)}
        onEtapaCreated={handleEtapaCreated}
      />
      <RegisterActivityModal
        isOpen={showRegisterActivityModal}
        onClose={() => setShowRegisterActivityModal(false)}
        onActivityRegistered={handleActivityRegistered}
      />
      {selectedProjectForStatusChange && (
        <ChangeProjectStatusModal
          isOpen={showChangeProjectStatusModal}
          onClose={() => setShowChangeProjectStatusModal(false)}
          project={selectedProjectForStatusChange}
          onStatusChanged={handleProjectStatusChanged}
        />
      )}

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
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
          box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
        }

        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 123, 255, 0.4);
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

        .project-row {
          background-color: #e6f0ff;
          font-weight: 600;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        .status-badge.planificacion { background: #007bff; }
        .status-badge.en_progreso { background: #ffc107; color: #333; }
        .status-badge.en_revision { background: #17a2b8; }
        .status-badge.finalizado { background: #28a745; }
        .status-badge.cancelado { background: #dc3545; }
        .status-badge.pendiente { background: #6c757d; }
        .status-badge.completada { background: #28a745; }
        .status-badge.atrasada { background: #dc3545; }
        .status-badge.por_hacer { background: #6c757d; }
        .status-badge.en_curso { background: #ffc107; color: #333; }
        .status-badge.bloqueada { background: #6f42c1; }

        .action-button-icon {
          background: none;
          border: none;
          color: #007bff;
          font-size: 18px;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .action-button-icon:hover {
          color: #0056b3;
        }

        .action-button-icon-small {
          background: none;
          border: none;
          color: #28a745;
          font-size: 18px;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .action-button-icon-small:hover {
          color: #218838;
        }

        .expanded-content-row td {
          padding: 0;
          border-bottom: none;
        }

        .nested-table-container {
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 8px;
          margin: 10px 0;
          box-shadow: inset 0 1px 5px rgba(0,0,0,0.05);
        }

        .nested-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .nested-title-small {
          font-size: 16px;
          font-weight: 600;
          color: #555;
          margin-bottom: 10px;
          padding-left: 10px;
        }

        .nested-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .nested-table th, .nested-table td {
          padding: 10px;
          border-bottom: 1px solid #f0f0f0;
          text-align: left;
          font-size: 13px;
          color: #222;
        }

        .nested-table th {
          background-color: #f3f3f3;
          font-weight: 700;
          color: #444;
        }

        .nested-table-row:last-child td {
          border-bottom: none;
        }

        .etapa-row {
          background-color: #f0f8ff;
        }

        .no-data {
          padding: 20px;
          text-align: center;
          color: #555;
        }
        .no-data-nested {
          padding: 10px;
          text-align: center;
          color: #777;
          font-style: italic;
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