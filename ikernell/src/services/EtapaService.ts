// src/services/EtapaService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Asegúrate de que coincida con tu backend

export type EtapaStatus = 'pendiente' | 'en_progreso' | 'completada' | 'atrasada'; // Coincide con tu backend

// Interfaz para los datos de la etapa que se enviarán al backend
export interface CreateEtapaPayload {
  nombre: string;
  proyecto: { idProyecto: number }; // Referencia al proyecto
  fechaInicioEstimada?: string; // Formato 'YYYY-MM-DD'
  fechaFinEstimada?: string; // Formato 'YYYY-MM-DD'
  estado: EtapaStatus;
}

// Interfaz para el objeto Etapa que se recibe del backend
export interface Etapa {
  idEtapa: number;
  nombre: string;
  proyecto: {
    idProyecto: number;
    nombre: string; // Incluimos el nombre del proyecto para mostrarlo
    // ... otros campos del proyecto si son necesarios
  };
  fechaInicioEstimada?: string;
  fechaFinEstimada?: string;
  estado: EtapaStatus;
}

/**
 * Crea una nueva etapa.
 * @param payload Los datos de la etapa a crear.
 * @returns La etapa creada.
 */
export const createEtapa = async (payload: CreateEtapaPayload): Promise<Etapa> => {
  try {
    const response = await axios.post<Etapa>(`${API_BASE_URL}/etapas`, payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear la etapa:', error);
    throw error;
  }
};

/**
 * Obtiene todas las etapas para un proyecto específico.
 * @param idProyecto El ID del proyecto.
 * @returns Una lista de etapas.
 */
export const getEtapasByProjectId = async (idProyecto: number): Promise<Etapa[]> => {
  try {
    const response = await axios.get<Etapa[]>(`${API_BASE_URL}/etapas/proyecto/${idProyecto}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener etapas para el proyecto ${idProyecto}:`, error);
    throw error;
  }
};

export const getEtapaById = async (id: number): Promise<Etapa> => {
  try {
    const response = await axios.get<Etapa>(`${API_BASE_URL}/etapas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la etapa ${id}:`, error);
    throw error;
  }
};

export const updateEtapa = async (id: number, payload: Partial<CreateEtapaPayload>): Promise<Etapa> => {
  try {
    const response = await axios.put<Etapa>(`${API_BASE_URL}/etapas/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la etapa ${id}:`, error);
    throw error;
  }
};

export const deleteEtapa = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/etapas/${id}`);
  } catch (error) {
    console.error(`Error al eliminar la etapa ${id}:`, error);
    throw error;
  }
};
