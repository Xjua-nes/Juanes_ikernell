// src/components/AssignDeveloperModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { createAsignacion } from '@/services/AsignacionService';
import { Project, getAllProjects } from '@/services/ProjectService';
import { getTrabajadores, Trabajador } from '../services/CoorService'; // Reutilizamos getTrabajadores

interface AssignDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentCreated: () => void; // Callback para cuando una asignación se crea exitosamente
}

export default function AssignDeveloperModal({ isOpen, onClose, onAssignmentCreated }: AssignDeveloperModalProps) {
  const [projectId, setProjectId] = useState<number>(0);
  const [developerId, setDeveloperId] = useState<number>(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Trabajador[]>([]); // Desarrolladores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const fetchedProjects = await getAllProjects();
          setProjects(fetchedProjects);
          if (fetchedProjects.length > 0) {
            setProjectId(fetchedProjects[0].idProyecto);
          }

          // Obtener solo trabajadores con rol 'Desarrollador'
          const fetchedDevelopers = await getTrabajadores('active'); // Obtener solo activos
          const developersOnly = fetchedDevelopers.filter((t: Trabajador) => t.rol?.nombre === 'Desarrollador');
          setDevelopers(developersOnly);
          if (developersOnly.length > 0) {
            setDeveloperId(developersOnly[0].idTrabajador || 0);
          }
        } catch (err) {
          console.error('Error al cargar datos para asignación:', err);
          setError('Error al cargar proyectos o desarrolladores.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      // Resetear estados al abrir el modal
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (projectId === 0 || developerId === 0) {
      setError('Por favor, seleccione un proyecto y un desarrollador.');
      setLoading(false);
      return;
    }

    try {
      await createAsignacion({
        proyecto: { idProyecto: projectId },
        desarrollador: { idTrabajador: developerId },
      });
      setSuccess('Desarrollador asignado exitosamente!');
      onAssignmentCreated(); // Notificar a la página padre
      setTimeout(() => {
        onClose();
        // Resetear formulario
        setProjectId(projects.length > 0 ? projects[0].idProyecto : 0);
        setDeveloperId(developers.length > 0 && developers[0].idTrabajador ? developers[0].idTrabajador : 0);
      }, 1500);
    } catch (err: any) {
      console.error('Error al asignar desarrollador:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(`Error al asignar desarrollador: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-project">
        <button onClick={onClose} className="modal-close-button" title="Cerrar">
          <FaTimes />
        </button>
        <h2 className="modal-title">Asignar Desarrollador a Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="projectId" className="form-label">Seleccionar Proyecto <span className="text-red-500">*</span></label>
            <select
              id="projectId"
              name="projectId"
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              className="form-input"
              required
              disabled={loading}
            >
              <option value={0}>Seleccionar Proyecto</option>
              {projects.map(project => (
                <option key={project.idProyecto} value={project.idProyecto}>
                  {project.nombre}
                </option>
              ))}
            </select>
            {projects.length === 0 && !loading && (
              <p className="text-sm text-red-500 mt-1">No hay proyectos disponibles.</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="developerId" className="form-label">Seleccionar Desarrollador <span className="text-red-500">*</span></label>
            <select
              id="developerId"
              name="developerId"
              value={developerId}
              onChange={(e) => setDeveloperId(Number(e.target.value))}
              className="form-input"
              required
              disabled={loading}
            >
              <option value={0}>Seleccionar Desarrollador</option>
              {developers.map(dev => (
                <option key={dev.idTrabajador} value={dev.idTrabajador}>
                  {dev.nombre} {dev.apellido}
                </option>
              ))}
            </select>
            {developers.length === 0 && !loading && (
              <p className="text-sm text-red-500 mt-1">No hay desarrolladores disponibles.</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-4">{success}</p>}

          <button
            type="submit"
            className="action-button-modal"
            disabled={loading || projectId === 0 || developerId === 0}
          >
            {loading ? (
              <FaSpinner className="animate-spin icon" />
            ) : (
              <FaSave className="icon" />
            )}
            {loading ? 'Asignando...' : 'Asignar Desarrollador'}
          </button>
        </form>
      </div>

      {/* Estilos reutilizados del modal de proyectos */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content-project {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 600px;
          position: relative;
          animation: slideInFromTop 0.3s ease-out;
          color: #333;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-close-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          color: #666;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .modal-close-button:hover {
          color: #333;
        }

        .modal-title {
          font-size: 26px;
          font-weight: 700;
          color: #222;
          margin-bottom: 25px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
          font-size: 15px;
        }

        .form-input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          color: #444;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .action-button-modal {
          width: 100%;
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          color: white;
          border: none;
          padding: 14px 25px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
          margin-top: 20px;
        }

        .action-button-modal:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4);
        }

        .action-button-modal:disabled {
          background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .icon {
          font-size: 18px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInFromTop {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 640px) {
          .modal-content-project {
            padding: 20px;
          }
          .modal-title {
            font-size: 22px;
          }
          .form-input, .action-button-modal {
            font-size: 14px;
            padding: 10px 15px;
          }
        }
      `}</style>
    </div>
  );
}
