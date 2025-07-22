import axios from 'axios';
import { Activity} from './ActivityService';
import { Project } from './ProjectService'; 
import { Trabajador } from './CoorService'; 

const API_BASE_URL = 'http://localhost:8080/api';

export interface CreateInterrupcionPayload {
  tipoInterrupcion: string;
  fechaInterrupcion?: string; 
  duracionMinutos: number;
  faseProyecto: string;
  descripcion?: string;
  actividad?: { idActividad: number }; // Solo el ID de la actividad si se asocia
  proyecto?: { idProyecto: number };   // Solo el ID del proyecto si se asocia
  desarrollador: { idTrabajador: number }; // ID del desarrollador que reporta
}

// Interfaz para la entidad Interrupcion que se recibe del backend
export interface Interrupcion {
  idInterrupcion: number;
  tipoInterrupcion: string;
  fechaInterrupcion: string;
  duracionMinutos: number;
  faseProyecto: string;
  descripcion?: string;
  actividad?: Activity; 
  proyecto?: Project;  
  desarrollador: Trabajador; // Objeto Trabajador completo
}

/**
 * Registra una nueva interrupción en el backend.
 * @param payload Los datos de la interrupción a registrar.
 * @returns El objeto Interrupcion creado.
 */
export const createInterrupcion = async (payload: CreateInterrupcionPayload): Promise<Interrupcion> => {
  try {
    const response = await axios.post<Interrupcion>(`${API_BASE_URL}/interrupciones`, payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear la interrupción:', error);
    throw error;
  }
};

/**
 * Obtiene todas las interrupciones.
 * @returns Una lista de interrupciones.
 */
export const getAllInterrupciones = async (): Promise<Interrupcion[]> => {
  try {
    const response = await axios.get<Interrupcion[]>(`${API_BASE_URL}/interrupciones`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las interrupciones:', error);
    throw error;
  }
};

