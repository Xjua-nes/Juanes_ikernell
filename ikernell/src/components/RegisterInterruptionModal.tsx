// src/components/RegisterInterruptionModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { createInterrupcion, CreateInterrupcionPayload } from '@/services/InterrupcionService'; // Importar el nuevo servicio
import { getAllProjects, Project } from '@/services/ProjectService'; // Para listar proyectos
import { getActivitiesByDeveloperId, Activity } from '@/services/ActivityService'; // Para listar actividades del desarrollador

interface RegisterInterruptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInterruptionRegistered: () => void;
}

export default function RegisterInterruptionModal({ isOpen, onClose, onInterruptionRegistered }: RegisterInterruptionModalProps) {
  const [formData, setFormData] = useState<Omit<CreateInterrupcionPayload, 'fechaInterrupcion' | 'desarrollador'>>({
    tipoInterrupcion: '',
    duracionMinutos: 0,
    faseProyecto: '',
    descripcion: '',
    actividad: undefined,
    proyecto: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // ID del desarrollador de prueba (ajusta según sea necesario, idealmente desde la autenticación)
  const currentDeveloperId = 3; 

  useEffect(() => {
    if (isOpen) {
      setFormData({
        tipoInterrupcion: '',
        duracionMinutos: 0,
        faseProyecto: '',
        descripcion: '',
        actividad: undefined,
        proyecto: undefined,
      });
      setError(null);
      setSuccess(null);

      const fetchRelatedData = async () => {
        try {
          const allProjects = await getAllProjects();
          setProjects(allProjects);
          const devActivities = await getActivitiesByDeveloperId(currentDeveloperId);
          setActivities(devActivities);
        } catch (err) {
          console.error('Error al cargar datos para el modal de interrupción:', err);
          setError('Error al cargar datos necesarios. Intente de nuevo.');
        }
      };
      fetchRelatedData();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'actividad' && value) {
      setFormData(prev => ({ ...prev, actividad: { idActividad: Number(value) }, proyecto: undefined }));
    } else if (name === 'proyecto' && value) {
      setFormData(prev => ({ ...prev, proyecto: { idProyecto: Number(value) }, actividad: undefined }));
    } else if (name === 'actividad' && !value) {
      setFormData(prev => ({ ...prev, actividad: undefined }));
    } else if (name === 'proyecto' && !value) {
      setFormData(prev => ({ ...prev, proyecto: undefined }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: name === 'duracionMinutos' ? Number(value) : value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.tipoInterrupcion || !formData.faseProyecto || formData.duracionMinutos <= 0) {
      setError('Por favor, complete todos los campos obligatorios y asegure que la duración sea mayor a 0.');
      setLoading(false);
      return;
    }

    if (!formData.actividad && !formData.proyecto) {
        setError('Debe seleccionar una actividad o un proyecto para asociar la interrupción.');
        setLoading(false);
        return;
    }

    const payloadToSend: CreateInterrupcionPayload = {
      ...formData,
      fechaInterrupcion: new Date().toISOString().split('T')[0], // Fecha actual
      desarrollador: { idTrabajador: currentDeveloperId }, 
      actividad: formData.actividad,
      proyecto: formData.proyecto,
    };

    try {
      await createInterrupcion(payloadToSend);
      setSuccess('Interrupción registrada exitosamente!');
      onInterruptionRegistered();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error al registrar la interrupción:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(`Error al registrar: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button" title="Cerrar">
          <FaTimes />
        </button>
        <h2 className="modal-title">Registrar Nueva Interrupción</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tipoInterrupcion" className="form-label">Tipo de Interrupción <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="tipoInterrupcion"
              name="tipoInterrupcion"
              value={formData.tipoInterrupcion}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: Reunión, Problema técnico, Ausencia"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duracionMinutos" className="form-label">Duración (minutos) <span className="text-red-500">*</span></label>
            <input
              type="number"
              id="duracionMinutos"
              name="duracionMinutos"
              value={formData.duracionMinutos}
              onChange={handleChange}
              className="form-input"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="faseProyecto" className="form-label">Fase del Proyecto <span className="text-red-500">*</span></label>
            <select
              id="faseProyecto"
              name="faseProyecto"
              value={formData.faseProyecto}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Seleccionar Fase</option>
              <option value="planificacion">Planificación</option>
              <option value="diseno">Diseño</option>
              <option value="desarrollo">Desarrollo</option>
              <option value="pruebas">Pruebas</option>
              <option value="despliegue">Despliegue</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion" className="form-label">Descripción (Opcional)</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="form-input"
              placeholder="Detalles adicionales sobre la interrupción"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="actividad" className="form-label">Asociar a Actividad (Opcional)</label>
            <select
              id="actividad"
              name="actividad"
              value={formData.actividad?.idActividad || ''}
              onChange={handleChange}
              className="form-input"
              disabled={!!formData.proyecto?.idProyecto}
            >
              <option value="">Seleccionar Actividad</option>
              {activities.map(act => (
                <option key={act.idActividad} value={act.idActividad}>
                  {act.nombre} (Proyecto: {act.etapa?.proyecto?.nombre || 'N/A'})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="proyecto" className="form-label">Asociar a Proyecto (Opcional)</label>
            <select
              id="proyecto"
              name="proyecto"
              value={formData.proyecto?.idProyecto || ''}
              onChange={handleChange}
              className="form-input"
              disabled={!!formData.actividad?.idActividad}
            >
              <option value="">Seleccionar Proyecto</option>
              {projects.map(proj => (
                <option key={proj.idProyecto} value={proj.idProyecto}>
                  {proj.nombre}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-4">{success}</p>}

          <button
            type="submit"
            className="action-button-modal"
            disabled={loading || (!formData.actividad && !formData.proyecto)}
          >
            {loading ? (
              <FaSpinner className="animate-spin icon" />
            ) : (
              <FaSave className="icon" />
            )}
            {loading ? 'Registrando...' : 'Registrar Interrupción'}
          </button>
        </form>
      </div>

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

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 550px;
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
          border-color: #2196F3; /* Color azul para este modal */
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
        }

        .action-button-modal {
          width: 100%;
          background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
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
          box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
          margin-top: 20px;
        }

        .action-button-modal:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
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
          .modal-content {
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
