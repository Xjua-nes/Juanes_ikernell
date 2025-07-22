// src/components/RegisterEtapaModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { CreateEtapaPayload, EtapaStatus, createEtapa } from '@/services/EtapaService';
import { Project, getAllProjects } from '@/services/ProjectService'; // Para obtener la lista de proyectos

interface RegisterEtapaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEtapaCreated: () => void; // Callback para cuando una etapa se crea exitosamente
}

export default function RegisterEtapaModal({ isOpen, onClose, onEtapaCreated }: RegisterEtapaModalProps) {
  const [etapaData, setEtapaData] = useState<Omit<CreateEtapaPayload, 'proyecto'> & { idProyecto: number }>({
    nombre: '',
    idProyecto: 0, // Usamos un idProyecto plano para el select
    fechaInicioEstimada: '',
    fechaFinEstimada: '',
    estado: 'pendiente',
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cargar proyectos cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      const fetchProjects = async () => {
        try {
          const fetchedProjects = await getAllProjects(); // Obtener todos los proyectos
          setProjects(fetchedProjects);
          // Si hay proyectos, seleccionar el primero por defecto
          if (fetchedProjects.length > 0) {
            setEtapaData(prev => ({ ...prev, idProyecto: fetchedProjects[0].idProyecto }));
          } else {
            setEtapaData(prev => ({ ...prev, idProyecto: 0 }));
          }
        } catch (err) {
          console.error('Error al cargar proyectos para etapas:', err);
          setError('Error al cargar la lista de proyectos.');
        }
      };
      fetchProjects();
      // Resetear estados al abrir el modal
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEtapaData(prev => ({
      ...prev,
      [name]: name === 'idProyecto' ? Number(value) : value, // Convertir idProyecto a número
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validaciones básicas
    if (!etapaData.nombre || etapaData.idProyecto === 0) {
      setError('Por favor, complete todos los campos obligatorios (Nombre, Proyecto).');
      setLoading(false);
      return;
    }

    // Construir el payload para el backend, con el proyecto anidado
    const payloadToSend: CreateEtapaPayload = {
      nombre: etapaData.nombre,
      proyecto: { idProyecto: etapaData.idProyecto }, // Aquí se anida el ID del proyecto
      fechaInicioEstimada: etapaData.fechaInicioEstimada,
      fechaFinEstimada: etapaData.fechaFinEstimada,
      estado: etapaData.estado,
    };

    try {
      await createEtapa(payloadToSend);
      setSuccess('Etapa creada exitosamente!');
      onEtapaCreated(); // Notificar a la página padre que una etapa fue creada
      // Opcional: Cerrar el modal después de un breve retraso
      setTimeout(() => {
        onClose();
        setEtapaData({ // Resetear el formulario para futuras creaciones
          nombre: '',
          idProyecto: 0,
          fechaInicioEstimada: '',
          fechaFinEstimada: '',
          estado: 'pendiente',
        });
      }, 1500);
    } catch (err: any) {
      console.error('Error al crear la etapa:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(`Error al crear la etapa: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-project"> {/* Reutilizo la clase de estilo del modal de proyecto */}
        <button onClick={onClose} className="modal-close-button" title="Cerrar">
          <FaTimes />
        </button>
        <h2 className="modal-title">Registrar Nueva Etapa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre de la Etapa <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={etapaData.nombre}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="idProyecto" className="form-label">Proyecto Asociado <span className="text-red-500">*</span></label>
            <select
              id="idProyecto"
              name="idProyecto"
              value={etapaData.idProyecto}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value={0}>Seleccionar Proyecto</option>
              {projects.map(project => (
                <option key={project.idProyecto} value={project.idProyecto}>
                  {project.nombre}
                </option>
              ))}
            </select>
            {projects.length === 0 && !loading && (
              <p className="text-sm text-red-500 mt-1">No hay proyectos disponibles. Crea un proyecto primero.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="fechaInicioEstimada" className="form-label">Fecha Inicio Estimada</label>
              <input
                type="date"
                id="fechaInicioEstimada"
                name="fechaInicioEstimada"
                value={etapaData.fechaInicioEstimada}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="fechaFinEstimada" className="form-label">Fecha Fin Estimada</label>
              <input
                type="date"
                id="fechaFinEstimada"
                name="fechaFinEstimada"
                value={etapaData.fechaFinEstimada}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="estado" className="form-label">Estado de la Etapa</label>
            <select
              id="estado"
              name="estado"
              value={etapaData.estado}
              onChange={handleChange}
              className="form-input"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completada</option>
              <option value="atrasada">Atrasada</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-4">{success}</p>}

          <button
            type="submit"
            className="action-button-modal"
            disabled={loading || !etapaData.nombre || etapaData.idProyecto === 0}
          >
            {loading ? (
              <FaSpinner className="animate-spin icon" />
            ) : (
              <FaSave className="icon" />
            )}
            {loading ? 'Registrando...' : 'Registrar Etapa'}
          </button>
        </form>
      </div>

      {/* Los estilos son los mismos que los del modal de proyecto, así que no se repiten aquí */}
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
          max-height: 90vh; /* Altura máxima para permitir scroll */
          overflow-y: auto; /* Habilitar scroll */
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
