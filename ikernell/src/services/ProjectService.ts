// src/services/ProjectService.ts
import axios from 'axios';

// Define la URL base de tu API de backend
const API_BASE_URL = 'http://localhost:8080/api'; // Ajusta esto a la URL real de tu backend

// Interfaz para el estado del proyecto (basado en el ENUM de tu DB)
export type ProjectStatus = 'planificacion' | 'en_progreso' | 'en_revision' | 'finalizado' | 'cancelado';

// Interfaz para el objeto Líder (Trabajador) simplificado para el payload de creación/actualización
export interface ProjectLeaderPayload {
  idTrabajador: number;
}

export interface Leader {
  idTrabajador: number;
  nombre: string;
  apellido: string;
  // Puedes añadir más campos del Trabajador aquí si tu backend los devuelve (ej: email, profesion)
}

// Interfaz para los datos del proyecto que se enviarán al backend para CREACIÓN
export interface CreateProjectPayload {
  nombre: string;
  descripcion?: string; // Opcional
  fechaInicio: string; // Formato 'YYYY-MM-DD'
  fechaFinEstimada?: string; // Formato 'YYYY-MM-DD', opcional
  lider: ProjectLeaderPayload; // Enviamos el líder como un objeto anidado con solo el ID
  estado: ProjectStatus;
}

// Interfaz para los datos del proyecto que se enviarán al backend para ACTUALIZACIÓN (parciales)
export interface UpdateProjectPayload {
  nombre?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFinEstimada?: string;
  lider?: ProjectLeaderPayload; // Para actualización, el backend espera el objeto completo si se envía
  estado?: ProjectStatus;
}

// Interfaz para el objeto Proyecto que se recibe del backend (con id y objeto lider completo)
export interface Project {
  idProyecto: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string; // Se recibirá como string ISO
  fechaFinEstimada?: string; // Se recibirá como string ISO
  lider: Leader; // El backend devuelve el objeto Trabajador completo, usando la interfaz Leader
  estado: ProjectStatus;
}

/**
 * Crea un nuevo proyecto en el backend.
 * @param payload Los datos del proyecto a crear, con el líder anidado.
 * @returns Una promesa que resuelve con el proyecto creado.
 */
export const createProject = async (payload: CreateProjectPayload): Promise<Project> => {
  try {
    const response = await axios.post<Project>(`${API_BASE_URL}/proyectos`, payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de trabajadores con el rol 'Líder'.
 * Esto llama a tu endpoint GET /api/trabajadores/leaders
 * @returns Una lista de objetos Leader.
 */
export const getLeaders = async (): Promise<Leader[]> => {
  try {
    // Asegúrate de que tu backend tenga un endpoint como /api/trabajadores/leaders
    // que devuelva solo los trabajadores con el rol de "Líder".
    // Si no tienes este endpoint específico, podrías necesitar obtener todos los trabajadores
    // y filtrarlos en el frontend, o añadir el endpoint en el backend.
    const response = await axios.get<Leader[]>(`${API_BASE_URL}/trabajadores/leaders`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener líderes:', error);
    throw error;
  }
};

/**
 * Obtiene todos los proyectos.
 * @returns Una promesa que resuelve con la lista de proyectos.
 */
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get<Project[]>(`${API_BASE_URL}/proyectos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los proyectos:', error);
    throw error;
  }
};

/**
 * Obtiene un proyecto por su ID.
 * @param id El ID del proyecto.
 * @returns Una promesa que resuelve con el proyecto.
 */
export const getProjectById = async (id: number): Promise<Project> => {
  try {
    const response = await axios.get<Project>(`${API_BASE_URL}/proyectos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el proyecto ${id}:`, error);
    throw error;
  }
};


/**
 * Actualiza un proyecto existente.
 * @param id El ID del proyecto a actualizar.
 * @param payload Los datos a actualizar.
 * @returns Una promesa que resuelve con el proyecto actualizado.
 */
export const updateProject = async (id: number, payload: UpdateProjectPayload): Promise<Project> => {
  try {
    const response = await axios.put<Project>(`${API_BASE_URL}/proyectos/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el proyecto ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina (o deshabilita) un proyecto.
 * NOTA: La implementación de 'eliminar' o 'deshabilitar' depende de tu backend.
 * Si es una eliminación lógica (cambiar estado 'activo' a false), el payload debería incluir eso.
 * Si es una eliminación física (DELETE), el backend debería manejarlo.
 * @param id El ID del proyecto a eliminar/deshabilitar.
 */
export const deleteProject = async (id: number): Promise<void> => {
  try {
    // Esto asume un endpoint DELETE. Si tu backend usa un PUT para deshabilitar,
    // deberías cambiar esto a un PUT con un payload de estado.
    await axios.delete(`${API_BASE_URL}/proyectos/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el proyecto ${id}:`, error);
    throw error;
  }
};