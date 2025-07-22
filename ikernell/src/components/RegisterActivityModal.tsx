// src/components/RegisterActivityModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { createActivity, ActivityStatus, CreateActivityPayload } from '@/services/ActivityService';
import { Etapa, getEtapasByProjectId } from '@/services/EtapaService';
import { Project, getAllProjects } from '@/services/ProjectService';
import { getTrabajadores, Trabajador } from '@/services/CoorService';

interface RegisterActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivityRegistered: () => void; // Callback para cuando una actividad se registra exitosamente
}

export default function RegisterActivityModal({ isOpen, onClose, onActivityRegistered }: RegisterActivityModalProps) {
  const [activityData, setActivityData] = useState<Omit<CreateActivityPayload, 'etapa' | 'desarrollador'> & { idEtapa: number; idDesarrollador: number }>({
    nombre: '',
    descripcion: '',
    idEtapa: 0,
    idDesarrollador: 0,
    fechaInicioEstimada: '',
    fechaFinEstimada: '',
    estado: 'pendiente',
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [developers, setDevelopers] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cargar proyectos y desarrolladores al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const fetchedProjects = await getAllProjects();
          setProjects(fetchedProjects);
          if (fetchedProjects.length > 0) {
            setSelectedProjectId(fetchedProjects[0].idProyecto);
          }

          const fetchedDevelopers = await getTrabajadores('active');
          const developersOnly = fetchedDevelopers.filter((t: Trabajador) => t.rol?.nombre === 'Desarrollador');
          setDevelopers(developersOnly);
          if (developersOnly.length > 0) {
            setActivityData(prev => ({ ...prev, idDesarrollador: developersOnly[0].idTrabajador || 0 }));
          }
        } catch (err) {
          console.error('Error al cargar datos para actividades:', err);
          setError('Error al cargar proyectos o desarrolladores.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  // Cargar etapas cuando el proyecto seleccionado cambia
  useEffect(() => {
    const loadEtapas = async () => {
      if (selectedProjectId > 0) {
        try {
          const fetchedEtapas = await getEtapasByProjectId(selectedProjectId);
          setEtapas(fetchedEtapas);
          if (fetchedEtapas.length > 0) {
            setActivityData(prev => ({ ...prev, idEtapa: fetchedEtapas[0].idEtapa }));
          } else {
            setActivityData(prev => ({ ...prev, idEtapa: 0 }));
          }
        } catch (err) {
          console.error('Error al cargar etapas:', err);
          setError('Error al cargar las etapas del proyecto seleccionado.');
        }
      } else {
        setEtapas([]);
        setActivityData(prev => ({ ...prev, idEtapa: 0 }));
      }
    };
    loadEtapas();
  }, [selectedProjectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setActivityData(prev => ({
      ...prev,
      [name]: (name === 'idEtapa' || name === 'idDesarrollador') ? Number(value) : value,
    }));
  };

  const handleProjectSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProjectId(Number(e.target.value));
    setEtapas([]); // Reset etapas when project changes
    setActivityData(prev => ({ ...prev, idEtapa: 0 })); // Reset selected etapa
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!activityData.nombre || activityData.idEtapa === 0 || activityData.idDesarrollador === 0) {
      setError('Por favor, complete todos los campos obligatorios (Nombre, Etapa, Desarrollador).');
      setLoading(false);
      return;
    }

    try {
      await createActivity({
        nombre: activityData.nombre,
        descripcion: activityData.descripcion,
        etapa: { idEtapa: activityData.idEtapa },
        desarrollador: { idTrabajador: activityData.idDesarrollador },
        fechaInicioEstimada: activityData.fechaInicioEstimada,
        fechaFinEstimada: activityData.fechaFinEstimada,
        estado: activityData.estado,
      });
      setSuccess('Actividad registrada exitosamente!');
      onActivityRegistered();
      setTimeout(() => {
        onClose();
        setActivityData({
          nombre: '',
          descripcion: '',
          idEtapa: 0,
          idDesarrollador: 0,
          fechaInicioEstimada: '',
          fechaFinEstimada: '',
          estado: 'pendiente',
        });
        setSelectedProjectId(0); // Resetear el proyecto seleccionado también
      }, 1500);
    } catch (err: any) {
      console.error('Error al registrar actividad:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(`Error al registrar actividad: ${errorMessage}`);
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
        <h2 className="modal-title">Registrar Nueva Actividad</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre de la Actividad <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={activityData.nombre}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={activityData.descripcion}
              onChange={handleChange}
              rows={3}
              className="form-input"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="selectedProjectId" className="form-label">Seleccionar Proyecto <span className="text-red-500">*</span></label>
            <select
              id="selectedProjectId"
              name="selectedProjectId"
              value={selectedProjectId}
              onChange={handleProjectSelectChange}
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
            <label htmlFor="idEtapa" className="form-label">Etapa Asociada <span className="text-red-500">*</span></label>
            <select
              id="idEtapa"
              name="idEtapa"
              value={activityData.idEtapa}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading || etapas.length === 0}
            >
              <option value={0}>Seleccionar Etapa</option>
              {etapas.map(etapa => (
                <option key={etapa.idEtapa} value={etapa.idEtapa}>
                  {etapa.nombre}
                </option>
              ))}
            </select>
            {selectedProjectId > 0 && etapas.length === 0 && !loading && (
              <p className="text-sm text-red-500 mt-1">No hay etapas para el proyecto seleccionado.</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="idDesarrollador" className="form-label">Asignar a Desarrollador <span className="text-red-500">*</span></label>
            <select
              id="idDesarrollador"
              name="idDesarrollador"
              value={activityData.idDesarrollador}
              onChange={handleChange}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="fechaInicioEstimada" className="form-label">Fecha Inicio Estimada</label>
              <input
                type="date"
                id="fechaInicioEstimada"
                name="fechaInicioEstimada"
                value={activityData.fechaInicioEstimada}
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
                value={activityData.fechaFinEstimada}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="estado" className="form-label">Estado de la Actividad</label>
            <select
              id="estado"
              name="estado"
              value={activityData.estado}
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
            disabled={loading || !activityData.nombre || activityData.idEtapa === 0 || activityData.idDesarrollador === 0}
          >
            {loading ? (
              <FaSpinner className="animate-spin icon" />
            ) : (
              <FaSave className="icon" />
            )}
            {loading ? 'Registrando...' : 'Registrar Actividad'}
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
