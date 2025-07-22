// src/services/ErrorService.ts
import axios from 'axios';
import { Activity } from '../services/ActivityService'; 
import { Project } from '../services/ProjectService'; 
import { Trabajador } from './CoorService'; 

const API_BASE_URL = 'http://localhost:8080/api';

// Interfaz para el payload de creación de un error
export interface CreateErrorPayload {
  tipoError: string;
  descripcion: string;
  faseProyecto: string;
  fechaReporte?: string; // Opcional, el backend puede generarlo
  actividad?: { idActividad: number }; // Solo el ID de la actividad si se asocia
  proyecto?: { idProyecto: number };   // Solo el ID del proyecto si se asocia
  desarrollador: { idTrabajador: number }; // ID del desarrollador que reporta
}

// Interfaz para la entidad Error que se recibe del backend
export interface Error {
  idError: number;
  tipoError: string;
  descripcion: string;
  faseProyecto: string;
  fechaReporte: string;
  actividad: Activity; 
  proyecto: Project; 
  desarrollador: Trabajador; // Objeto Trabajador completo
}

/**
 * Registra un nuevo error en el backend.
 * @param payload Los datos del error a registrar.
 * @returns El objeto Error creado.
 */
export const createError = async (payload: CreateErrorPayload): Promise<Error> => {
  try {
    const response = await axios.post<Error>(`${API_BASE_URL}/errores`, payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear el error:', error);
    throw error;
  }
};

/**
 * Obtiene todos los errores.
 * @returns Una lista de errores.
 */
export const getAllErrors = async (): Promise<Error[]> => {
  try {
    const response = await axios.get<Error[]>(`${API_BASE_URL}/errores`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los errores:', error);
    throw error;
  }
};

