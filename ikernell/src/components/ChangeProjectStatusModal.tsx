// src/components/ChangeProjectStatusModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { Project, ProjectStatus, updateProject } from '@/services/ProjectService';

interface ChangeProjectStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project; // El proyecto cuyo estado se va a cambiar
  onStatusChanged: () => void; // Callback para cuando el estado se cambia exitosamente
}

export default function ChangeProjectStatusModal({ isOpen, onClose, project, onStatusChanged }: ChangeProjectStatusModalProps) {
  const [newStatus, setNewStatus] = useState<ProjectStatus>(project.estado);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sincronizar el estado del modal con el proyecto prop cuando se abre o el proyecto cambia
  useEffect(() => {
    if (isOpen && project) {
      setNewStatus(project.estado);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (newStatus === project.estado) {
      setError('El estado seleccionado es el mismo que el actual.');
      setLoading(false);
      return;
    }

    try {
      // Usar la función updateProject para cambiar solo el estado
      await updateProject(project.idProyecto, { estado: newStatus });
      setSuccess('Estado del proyecto actualizado exitosamente!');
      onStatusChanged(); // Notificar a la página padre
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error al cambiar el estado del proyecto:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(`Error al actualizar estado: ${errorMessage}`);
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
        <h2 className="modal-title">Cambiar Estado del Proyecto: {project.nombre}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newStatus" className="form-label">Nuevo Estado <span className="text-red-500">*</span></label>
            <select
              id="newStatus"
              name="newStatus"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}
              className="form-input"
              required
              disabled={loading}
            >
              <option value="planificacion">Planificación</option>
              <option value="en_progreso">En Progreso</option>
              <option value="en_revision">En Revisión</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-4">{success}</p>}

          <button
            type="submit"
            className="action-button-modal"
            disabled={loading || newStatus === project.estado}
          >
            {loading ? (
              <FaSpinner className="animate-spin icon" />
            ) : (
              <FaSave className="icon" />
            )}
            {loading ? 'Guardando...' : 'Guardar Cambios'}
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
          max-width: 500px; /* Un poco más pequeño para este modal */
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
