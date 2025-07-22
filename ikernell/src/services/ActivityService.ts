// src/services/ActivityService.ts
import axios from 'axios';
import { Trabajador } from './CoorService'; // Necesario para el tipo de desarrollador anidado
import { Etapa } from './EtapaService'; // Necesario para el tipo de etapa anidado
import { Project } from './ProjectService'; // Necesario para el tipo de proyecto anidado

const API_BASE_URL = 'http://localhost:8080/api';

export type ActivityStatus = 'por_hacer' | 'en_curso' | 'completada' | 'bloqueada' | 'atrasada';

// Asegúrate de que esta interfaz esté exportada
export interface Activity {
  idActividad: number;
  nombre: string;
  descripcion?: string;
  fechaInicioEstimada: string;
  fechaFinEstimada?: string;
  estado: ActivityStatus;
  etapa: Etapa; // Asumiendo que el backend devuelve el objeto etapa completo
  desarrollador: Trabajador; // Asumiendo que el backend devuelve el objeto desarrollador completo
}

export interface CreateActivityPayload {
  nombre: string;
  descripcion?: string;
  fechaInicioEstimada: string;
  fechaFinEstimada?: string;
  idEtapa: number; // Solo el ID de la etapa
  idDesarrollador: number; // Solo el ID del desarrollador
  estado: ActivityStatus;
}

/**
 * Obtiene todas las actividades.
 * @returns Una promesa que resuelve con la lista de actividades.
 */
export const getAllActivities = async (): Promise<Activity[]> => {
  try {
    const response = await axios.get<Activity[]>(`${API_BASE_URL}/actividades`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las actividades:', error);
    throw error;
  }
};

/**
 * Obtiene una actividad por su ID.
 * @param id El ID de la actividad.
 * @returns La actividad.
 */
export const getActivityById = async (id: number): Promise<Activity> => {
  try {
    const response = await axios.get<Activity>(`${API_BASE_URL}/actividades/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener actividad ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene actividades por ID de etapa.
 * @param etapaId El ID de la etapa.
 * @returns Una lista de actividades.
 */
export const getActivitiesByEtapaId = async (etapaId: number): Promise<Activity[]> => {
  try {
    const response = await axios.get<Activity[]>(`${API_BASE_URL}/actividades/etapa/${etapaId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener actividades para la etapa ${etapaId}:`, error);
    throw error;
  }
};

/**
 * Obtiene actividades asignadas a un desarrollador específico.
 * @param developerId El ID del desarrollador.
 * @returns Una lista de actividades.
 */
export const getActivitiesByDeveloperId = async (developerId: number): Promise<Activity[]> => {
  try {
    const response = await axios.get<Activity[]>(`${API_BASE_URL}/actividades/desarrollador/${developerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener actividades para el desarrollador ${developerId}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva actividad.
 * @param payload Los datos de la actividad a crear.
 * @returns La actividad creada.
 */
export const createActivity = async (payload: CreateActivityPayload): Promise<Activity> => {
  try {
    const response = await axios.post<Activity>(`${API_BASE_URL}/actividades`, payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear la actividad:', error);
    throw error;
  }
};

/**
 * Actualiza una actividad existente.
 * @param id ID de la actividad a actualizar.
 * @param payload Los datos parciales de la actividad a actualizar.
 * @returns La actividad actualizada.
 */
export const updateActivity = async (id: number, payload: Partial<CreateActivityPayload>): Promise<Activity> => {
  try {
    const response = await axios.put<Activity>(`${API_BASE_URL}/actividades/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la actividad ${id}:`, error);
    throw error;
  }
};

/**
 * Actualiza solo el estado de una actividad.
 * @param id ID de la actividad.
 * @param newStatus El nuevo estado de la actividad.
 * @returns La actividad actualizada.
 */
export const updateActivityStatus = async (id: number, newStatus: ActivityStatus): Promise<Activity> => {
  try {
    // El backend espera un String en el @RequestBody, por lo que enviamos el String directamente.
    const response = await axios.put<Activity>(`${API_BASE_URL}/actividades/${id}/estado`, newStatus, {
      headers: {
        'Content-Type': 'text/plain' // Importante para enviar un String directamente
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el estado de la actividad ${id}:`, error);
    throw error;
  }
};


export const deleteActivity = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/actividades/${id}`);
  } catch (error) {
    console.error(`Error al eliminar la actividad ${id}:`, error);
    throw error;
  }
};
