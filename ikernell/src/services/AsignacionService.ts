// src/services/AsignacionService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Asegúrate de que coincida con tu backend

// Interfaz para los datos de asignación que se enviarán al backend
export interface CreateAsignacionPayload {
  proyecto: { idProyecto: number };
  desarrollador: { idTrabajador: number };
  fechaAsignacion?: string; // Opcional, el backend puede poner LocalDate.now()
  activo?: boolean; // Opcional, el backend puede poner true por defecto
}

// Interfaz para el objeto de Asignación que se recibe del backend
export interface Asignacion {
  idAsignacion: number;
  proyecto: {
    idProyecto: number;
    nombre: string;
    // Añade más campos de proyecto si los necesitas
  };
  desarrollador: {
    idTrabajador: number;
    nombre: string;
    apellido: string;
    // Añade más campos de trabajador si los necesitas
  };
  fechaAsignacion: string; // Se recibirá como string ISO
  activo: boolean;
}

/**
 * Asigna un desarrollador a un proyecto.
 * @param payload Los datos de la asignación a crear.
 * @returns La asignación creada.
 */
export const createAsignacion = async (payload: CreateAsignacionPayload): Promise<Asignacion> => {
  try {
    const response = await axios.post<Asignacion>(`${API_BASE_URL}/asignaciones`, payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear la asignación:', error);
    throw error;
  }
};

/**
 * Obtiene todas las asignaciones para un proyecto específico.
 * @param idProyecto El ID del proyecto.
 * @returns Una lista de asignaciones.
 */
export const getAsignacionesByProjectId = async (idProyecto: number): Promise<Asignacion[]> => {
  try {
    const response = await axios.get<Asignacion[]>(`${API_BASE_URL}/asignaciones/proyecto/${idProyecto}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener asignaciones para el proyecto ${idProyecto}:`, error);
    throw error;
  }
};

/**
 * Obtiene todas las asignaciones para un desarrollador específico.
 * @param idDesarrollador El ID del desarrollador.
 * @returns Una lista de asignaciones.
 */
export const getAsignacionesByDeveloperId = async (idDesarrollador: number): Promise<Asignacion[]> => {
  try {
    const response = await axios.get<Asignacion[]>(`${API_BASE_URL}/asignaciones/desarrollador/${idDesarrollador}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener asignaciones para el desarrollador ${idDesarrollador}:`, error);
    throw error;
  }
};
