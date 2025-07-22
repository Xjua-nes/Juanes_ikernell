'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getTrabajadores,
  createTrabajador,
  disableTrabajador,
  getRoles,
  deleteTrabajador,
  updateTrabajador,
  enableTrabajador
} from '@/services/CoorService';
import { FaBook, FaFolderPlus, FaComments, FaSave, FaTimesCircle, FaFilter, FaEdit, FaUserSlash, FaUserCheck, FaTrash, FaTimes, FaProjectDiagram } from 'react-icons/fa'; // Añadido FaProjectDiagram
import CreateProjectModal from '@/components/CreateProjectModal'; // Importa el componente del modal
import { Project, getAllProjects } from '@/services/ProjectService'; // Importa Project y getAllProjects

interface Trabajador {
  idTrabajador?: number;
  nombre: string;
  apellido: string;
  email: string;
  identificacion: string;
  profesion: string;
  direccion: string;
  especialidad: string;
  contrasena: string;
  rol?: { idRol: number; nombre: string };
  idRol: number | string;
  activo?: boolean;
}

interface Rol {
  idRol: number;
  nombre: string;
}

export default function CoordinadorPage() {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [nuevoTrabajador, setNuevoTrabajador] = useState<Trabajador>({
    nombre: '', apellido: '', email: '', identificacion: '', profesion: '', direccion: '', especialidad: '', contrasena: '', idRol: ''
  });
  const [roles, setRoles] = useState<Rol[]>([]);
  const [editingTrabajadorId, setEditingTrabajadorId] = useState<number | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [trabajadorToDelete, setTrabajadorToDelete] = useState<number | null>(null);

  const [filterNombre, setFilterNombre] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterRol, setFilterRol] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Nuevo estado para controlar la visibilidad del modal de creación de proyectos
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  // Nuevo estado para almacenar los proyectos
  const [projects, setProjects] = useState<Project[]>([]);

  const router = useRouter();

  useEffect(() => {
    cargarTrabajadores();
    cargarRoles();
    cargarProyectos(); // Cargar proyectos al montar el componente
  }, [filterStatus]);

  const cargarTrabajadores = async () => {
    try {
      const data = await getTrabajadores(filterStatus);
      setTrabajadores(data);
    } catch (error) {
      console.error('Error al obtener trabajadores:', error);
    }
  };

  const cargarRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  };

  const cargarProyectos = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
    }
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNuevoTrabajador({ ...nuevoTrabajador, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const trabajadorData = {
        ...nuevoTrabajador,
        idRol: Number(nuevoTrabajador.idRol)
      };

      if (editingTrabajadorId) {
        await updateTrabajador(editingTrabajadorId, trabajadorData);
        setEditingTrabajadorId(null);
      } else {
        await createTrabajador(trabajadorData);
      }
      resetForm();
      cargarTrabajadores();
    } catch (error: any) {
      console.error('Error al guardar trabajador:', error);
      if (error.response && error.response.data) {
        alert(`Error del servidor: ${error.response.data.message || error.response.data}`);
      } else {
        alert('Error al guardar trabajador. Por favor, intente de nuevo.');
      }
    }
  };

  const handleEdit = (trabajador: Trabajador) => {
    setNuevoTrabajador({
      ...trabajador,
      idRol: trabajador.rol?.idRol || ''
    } as Trabajador);
    setEditingTrabajadorId(trabajador.idTrabajador || null);
  };

  const resetForm = () => {
    setNuevoTrabajador({ nombre: '', apellido: '', email: '', identificacion: '', profesion: '', direccion: '', especialidad: '', contrasena: '', idRol: '' });
    setEditingTrabajadorId(null);
  };

  const inhabilitar = async (id: number | undefined) => {
    if (id === undefined) return;
    try {
      await disableTrabajador(id);
      cargarTrabajadores();
    } catch (error) {
      console.error('Error al inhabilitar trabajador:', error);
      alert('Error al inhabilitar trabajador. Verifique que el ID existe.');
    }
  };

  const habilitar = async (id: number | undefined) => {
    if (id === undefined) return;
    try {
      await enableTrabajador(id);
      cargarTrabajadores();
    } catch (error) {
      console.error('Error al habilitar trabajador:', error);
      alert('Error al habilitar trabajador. Verifique que el ID existe.');
    }
  };

  const handleDeleteClick = (id: number | undefined) => {
    if (id === undefined) return;
    setTrabajadorToDelete(id);
    setShowConfirmationModal(true);
  };

  const confirmarEliminar = async () => {
    if (trabajadorToDelete !== null) {
      try {
        await deleteTrabajador(trabajadorToDelete);
        cargarTrabajadores();
      } catch (error) {
        console.error('Error al eliminar trabajador:', error);
        alert('Error al eliminar trabajador.');
      } finally {
        setShowConfirmationModal(false);
        setTrabajadorToDelete(null);
      }
    }
  };

  const cancelarEliminar = () => {
    setShowConfirmationModal(false);
    setTrabajadorToDelete(null);
  };

  const filteredTrabajadores = trabajadores.filter(t => {
    const matchesNombre = t.nombre.toLowerCase().includes(filterNombre.toLowerCase()) || t.apellido.toLowerCase().includes(filterNombre.toLowerCase());
    const matchesEmail = t.email.toLowerCase().includes(filterEmail.toLowerCase());
    const matchesRol = filterRol === '' || (t.rol && t.rol.idRol === Number(filterRol));
    return matchesNombre && matchesEmail && matchesRol;
  });

  // Modificada para manejar la URL de WhatsApp y el modal de proyectos
  const handleNavigation = (path: string) => {
    if (path === '/crear-proyecto') {
      setShowCreateProjectModal(true); // Abrir el modal en lugar de navegar
    } else if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      router.push(path);
    }
  };

  // Callback para cuando el proyecto se crea exitosamente en el modal
  const handleProjectCreated = () => {
    setShowCreateProjectModal(false); // Cerrar el modal
    cargarProyectos(); // Recargar la lista de proyectos
  };

  return (
    <div className="container">
      <nav className="nav-bar">
        <div className="nav-container">
          <h1 className="nav-title">Panel del Coordinador</h1>
          <div className="nav-buttons">
            <button
              onClick={() => handleNavigation('/recursos')}
              className="nav-button"
            >
              <FaBook className="icon" />
              Recursos
            </button>
            <button
              onClick={() => handleNavigation('/crear-proyecto')} 
              className="nav-button"
            >
              <FaFolderPlus className="icon" />
              Crear Proyecto
            </button>
            <button
              onClick={() => handleNavigation('https://chat.whatsapp.com/FtFnbRsvmqhJiGwsILClQt?mode=r_c')}
              className="nav-button"
            >
              <FaComments className="icon" />
              Chat Corporativo
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="card">
          <h2 className="card-title">
            {editingTrabajadorId ? 'Editar Trabajador' : 'Crear Nuevo Trabajador'}
          </h2>
          <div className="form-grid">
            {[
              { name: 'nombre', placeholder: 'Nombre', type: 'text' },
              { name: 'apellido', placeholder: 'Apellido', type: 'text' },
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'identificacion', placeholder: 'Identificación', type: 'text' },
              { name: 'profesion', placeholder: 'Profesión', type: 'text' },
              { name: 'direccion', placeholder: 'Dirección', type: 'text' },
              { name: 'especialidad', placeholder: 'Especialidad', type: 'text' },
              { name: 'contrasena', placeholder: 'Contraseña', type: 'password' }
            ].map((field) => (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name} className="form-label">
                  {field.placeholder}
                </label>
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={(nuevoTrabajador as any)[field.name]}
                  onChange={manejarCambio}
                  className="form-input"
                />
              </div>
            ))}
            <div className="form-group">
              <label htmlFor="idRol" className="form-label">
                Rol
              </label>
              <select
                id="idRol"
                name="idRol"
                value={nuevoTrabajador.idRol}
                onChange={manejarCambio}
                className="form-input"
              >
                <option value="">Seleccionar Rol</option>
                {roles.map((rol: Rol) => (
                  <option key={rol.idRol} value={rol.idRol}>{rol.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="button-group">
            <button
              onClick={handleSubmit}
              className="action-button"
            >
              <FaSave className="icon" />
              {editingTrabajadorId ? 'Actualizar Trabajador' : 'Crear Trabajador'}
            </button>
            {editingTrabajadorId && (
              <button
                onClick={resetForm}
                className="action-button cancel"
              >
                <FaTimesCircle className="icon" />
                Cancelar Edición
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">
            <FaFilter className="icon" />
            Filtros
          </h2>
          <div className="filter-grid">
            <div className="form-group">
              <label htmlFor="filterNombre" className="form-label">
                Nombre/Apellido
              </label>
              <input
                id="filterNombre"
                type="text"
                placeholder="Filtrar por Nombre/Apellido"
                value={filterNombre}
                onChange={(e) => setFilterNombre(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="filterEmail" className="form-label">
                Email
              </label>
              <input
                id="filterEmail"
                type="text"
                placeholder="Filtrar por Email"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="filterRol" className="form-label">
                Rol
              </label>
              <select
                id="filterRol"
                value={filterRol}
                onChange={(e) => setFilterRol(e.target.value)}
                className="form-input"
              >
                <option value="">Filtrar por Rol</option>
                {roles.map((rol: Rol) => (
                  <option key={rol.idRol} value={rol.idRol}>{rol.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="filterStatus" className="form-label">
                Estado
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="form-input"
              >
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="all">Todos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección para mostrar Proyectos */}
        <div className="card">
          <h2 className="card-title">
            <FaProjectDiagram className="icon" /> {/* Icono para proyectos */}
            Proyectos Registrados
          </h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr className="table-header">
                  <th>Nombre del Proyecto</th>
                  <th>Líder</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin Estimada</th>
                  <th>Estado</th>
                  {/* Puedes añadir más columnas si lo deseas */}
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((p: Project) => (
                    <tr key={p.idProyecto} className="table-row">
                      <td>{p.nombre}</td>
                      <td>{p.lider ? `${p.lider.nombre} ${p.lider.apellido}` : 'N/A'}</td>
                      <td>{p.fechaInicio}</td>
                      <td>{p.fechaFinEstimada || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${p.estado}`}>
                          {p.estado.replace(/_/g, ' ')} {/* Reemplazar guiones bajos para mejor lectura */}
                        </span>
                      </td>
                      {/* Acciones para proyectos (editar, eliminar, etc.) irían aquí */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="no-data">No hay proyectos para mostrar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Trabajadores Registrados</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr className="table-header">
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrabajadores.length > 0 ? (
                  filteredTrabajadores.map((t: Trabajador) => (
                    <tr key={t.idTrabajador} className="table-row">
                      <td>{t.nombre} {t.apellido}</td>
                      <td>{t.email}</td>
                      <td>{t.rol?.nombre || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${t.activo ? 'active' : 'inactive'}`}>
                          {t.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(t)}
                            className="action-button edit"
                            title="Actualizar Trabajador"
                          >
                            <FaEdit className="icon" />
                            Actualizar
                          </button>
                          {t.activo ? (
                            <button
                              onClick={() => inhabilitar(t.idTrabajador)}
                              className="action-button disable"
                              title="Inhabilitar Trabajador"
                            >
                              <FaUserSlash className="icon" />
                              Inhabilitar
                            </button>
                          ) : (
                            <button
                              onClick={() => habilitar(t.idTrabajador)}
                              className="action-button enable"
                              title="Habilitar Trabajador"
                            >
                              <FaUserCheck className="icon" />
                              Habilitar
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(t.idTrabajador)}
                            className="action-button delete"
                            title="Eliminar Trabajador"
                          >
                            <FaTrash className="icon" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="no-data">No hay trabajadores para mostrar o no coinciden con los filtros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showConfirmationModal && (
          <div className="modal">
            <div className="modal-content">
              <h3 className="modal-title">Confirmar Eliminación</h3>
              <p className="modal-text">¿Estás seguro de que deseas eliminar este trabajador? Esta acción es irreversible.</p>
              <div className="modal-buttons">
                <button
                  onClick={cancelarEliminar}
                  className="action-button cancel"
                >
                  <FaTimes className="icon" />
                  Cancelar
                </button>
                <button
                  onClick={confirmarEliminar}
                  className="action-button delete"
                >
                  <FaTrash className="icon" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Creación de Proyecto */}
        <CreateProjectModal
          isOpen={showCreateProjectModal}
          onClose={() => setShowCreateProjectModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      </div>

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
        }

        .nav-button {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); /* Azul vibrante */
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          font-weight: 600; /* Más negrita */
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3); /* Sombra azul */
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

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          color: #222;
          font-weight: 600;
          font-size: 14px;
        }

        .form-input {
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          color: #333;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .button-group {
          display: flex;
          gap: 10px;
        }

        .action-button {
          background: linear-gradient(135deg, #28a745 0%, #218838 100%); /* Verde brillante */
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3); /* Sombra verde */
        }

        .action-button:hover {
          background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(40, 167, 69, 0.4);
        }

        .action-button.cancel {
          background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%); /* Gris más claro */
          color: white;
          box-shadow: 0 4px 10px rgba(108, 117, 125, 0.3);
        }

        .action-button.cancel:hover {
          background: linear-gradient(135deg, #5a6268 0%, #4e555b 100%);
          box-shadow: 0 6px 15px rgba(108, 117, 125, 0.4);
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .table-container {
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
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

        .status-badge.active {
          background: #28a745; /* Verde estándar */
        }

        .status-badge.inactive {
          background: #dc3545; /* Rojo estándar */
        }
        /* Estilos para los estados de proyecto */
        .status-badge.planificacion { background: #007bff; } /* Azul */
        .status-badge.en_progreso { background: #ffc107; color: #333; } /* Amarillo */
        .status-badge.en_revision { background: #17a2b8; } /* Cian */
        .status-badge.finalizado { background: #28a745; } /* Verde */
        .status-badge.cancelado { background: #dc3545; } /* Rojo */


        .action-buttons {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .action-button.edit {
          background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%); /* Amarillo vibrante */
          color: #333; /* Texto oscuro para contraste */
          box-shadow: 0 4px 10px rgba(255, 193, 7, 0.3);
        }

        .action-button.edit:hover {
          background: linear-gradient(135deg, #e0a800 0%, #cc9a00 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(255, 193, 7, 0.4);
        }

        .action-button.disable {
          background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); /* Cian/Azul-Verde */
          box-shadow: 0 4px 10px rgba(23, 162, 184, 0.3);
        }

        .action-button.disable:hover {
          background: linear-gradient(135deg, #138496 0%, #117a8b 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(23, 162, 184, 0.4);
        }

        .action-button.enable {
          background: linear-gradient(135deg, #6f42c1 0%, #563d7c 100%); /* Púrpura */
          box-shadow: 0 4px 10px rgba(111, 66, 193, 0.3);
        }

        .action-button.enable:hover {
          background: linear-gradient(135deg, #563d7c 0%, #493366 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(111, 66, 193, 0.4);
        }

        .action-button.delete {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); /* Rojo vibrante */
          box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);
        }

        .action-button.delete:hover {
          background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(220, 53, 69, 0.4);
        }

        .no-data {
          padding: 20px;
          text-align: center;
          color: #555;
        }

        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 50;
          animation: fadeIn 0.3s ease-in;
        }

        .modal-content {
          background: white;
          border-radius: 10px;
          padding: 30px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.3s ease-in;
        }

        .modal-title {
          color: #222;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .modal-text {
          color: #444;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .icon {
          font-size: 14px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
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
          .form-grid, .filter-grid {
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
