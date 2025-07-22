// src/components/CreateProjectModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { CreateProjectPayload, ProjectStatus, createProject, getLeaders, Leader } from '../services/ProjectService';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const [projectData, setProjectData] = useState<Omit<CreateProjectPayload, 'lider'> & { id_lider: number }>({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFinEstimada: '',
    id_lider: 0,
    estado: 'planificacion',
  });
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchLeaders = async () => {
        try {
          const fetchedLeaders = await getLeaders();
          setLeaders(fetchedLeaders);
          setProjectData(prev => ({
            ...prev,
            id_lider: fetchedLeaders.length > 0 ? fetchedLeaders[0].idTrabajador : 0,
          }));
        } catch (err) {
          console.error('Error al cargar líderes:', err);
          setError('Error al cargar la lista de líderes.');
        }
      };
      fetchLeaders();
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: name === 'id_lider' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!projectData.nombre || !projectData.fechaInicio || projectData.id_lider === 0) {
      setError('Por favor, complete todos los campos obligatorios (Nombre, Fecha de Inicio, Líder).');
      setLoading(false);
      return;
    }

    const payloadToSend: CreateProjectPayload = {
      nombre: projectData.nombre,
      descripcion: projectData.descripcion,
      fechaInicio: projectData.fechaInicio,
      fechaFinEstimada: projectData.fechaFinEstimada,
      lider: { idTrabajador: projectData.id_lider },
      estado: projectData.estado,
    };

    try {
      await createProject(payloadToSend);
      setSuccess('¡Proyecto creado exitosamente!');
      onProjectCreated();
      setTimeout(() => {
        onClose();
        setProjectData({
          nombre: '',
          descripcion: '',
          fechaInicio: '',
          fechaFinEstimada: '',
          id_lider: 0,
          estado: 'planificacion',
        });
      }, 1500);
    } catch (err: any) {
      console.error('Error al crear el proyecto:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(`Error al crear el proyecto: ${errorMessage}`);
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
        <h2 className="modal-title">Crear Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre del Proyecto <span className="text-red-500">*</span></label>
            <input type="text" id="nombre" name="nombre" value={projectData.nombre} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <textarea id="descripcion" name="descripcion" value={projectData.descripcion} onChange={handleChange} rows={3} className="form-input"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="fechaInicio" className="form-label">Fecha de Inicio <span className="text-red-500">*</span></label>
              <input type="date" id="fechaInicio" name="fechaInicio" value={projectData.fechaInicio} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label htmlFor="fechaFinEstimada" className="form-label">Fecha de Fin Estimada</label>
              <input type="date" id="fechaFinEstimada" name="fechaFinEstimada" value={projectData.fechaFinEstimada} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="id_lider" className="form-label">Líder del Proyecto <span className="text-red-500">*</span></label>
            <select id="id_lider" name="id_lider" value={projectData.id_lider} onChange={handleChange} className="form-input" required>
              <option value={0}>Seleccionar Líder</option>
              {leaders.map(leader => (
                <option key={leader.idTrabajador} value={leader.idTrabajador}>
                  {leader.nombre} {leader.apellido}
                </option>
              ))}
            </select>
            {leaders.length === 0 && !loading && (
              <p className="text-sm text-red-500 mt-1">No hay líderes disponibles. Asegúrate de que haya trabajadores con el rol 'Líder' en el sistema.</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="estado" className="form-label">Estado del Proyecto</label>
            <select id="estado" name="estado" value={projectData.estado} onChange={handleChange} className="form-input">
              <option value="planificacion">Planificación</option>
              <option value="en_progreso">En Progreso</option>
              <option value="en_revision">En Revisión</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-4">{success}</p>}

          <button type="submit" className="action-button-modal" disabled={loading}>
            {loading ? <FaSpinner className="animate-spin icon" /> : <FaSave className="icon" />}
            {loading ? 'Creando...' : 'Crear Proyecto'}
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
