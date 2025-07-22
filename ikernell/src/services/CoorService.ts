// src/services/CoorService.ts
import axios from 'axios';

const API = 'http://localhost:8080/api'; // Asegúrate de que coincida con tu backend

/**
 * Interfaz para un Rol
 */
export interface Rol {
  idRol: number;
  nombre: string;
}

/**
 * Interfaz para un Trabajador completo
 * idTrabajador ahora es OBLIGATORIO para los datos recuperados del backend.
 */
export interface Trabajador {
  idTrabajador: number; // Hacemos idTrabajador obligatorio
  nombre: string;
  apellido: string;
  email: string;
  identificacion: string;
  profesion: string;
  direccion: string;
  especialidad: string;
  contrasena: string;
  rol?: Rol; // Relación con el objeto Rol
  idRol: number | string; // Para el formulario, puede ser number o string (cuando se envía sin el objeto Rol completo)
  activo?: boolean;
}

/**
 * Interfaz simplificada para un Trabajador (Líder/Desarrollador)
 * Útil para selects donde solo se necesita el ID y el nombre.
 */
export interface SimpleTrabajador {
  idTrabajador: number;
  nombre: string;
  apellido: string;
}

/**
 * Obtiene trabajadores con filtro de estado.
 * @param status 'all' para todos, 'active' para activos, 'inactive' para inactivos.
 * @returns Una promesa que resuelve con la lista de trabajadores.
 */
export const getTrabajadores = async (status: 'all' | 'active' | 'inactive' = 'active'): Promise<Trabajador[]> => {
  let url = `${API}/trabajadores`;
  if (status === 'active') {
    url += '?activo=true';
  } else if (status === 'inactive') {
    url += '?activo=false';
  }
  const res = await axios.get<Trabajador[]>(url); // Tipado explícito de la respuesta
  return res.data;
};

/**
 * Crea un nuevo trabajador.
 * @param data Objeto con los datos del trabajador.
 * @returns Una promesa que resuelve con la respuesta de la API.
 */
export const createTrabajador = async (data: any) => {
  // Envía el idRol dentro de un objeto 'rol' para que el backend lo pueda procesar
  return axios.post(`${API}/trabajadores`, {
    ...data,
    rol: { idRol: Number(data.idRol) } // Asegurarse de que idRol sea un número
  });
};

/**
 * Actualiza un trabajador existente.
 * @param id ID del trabajador a actualizar.
 * @param data Objeto con los datos actualizados del trabajador.
 * @returns Una promesa que resuelve con la respuesta de la API.
 */
export const updateTrabajador = async (id: number, data: any) => {
  return axios.put(`${API}/trabajadores/${id}`, {
    ...data,
    rol: { idRol: Number(data.idRol) } // Asegurarse de que idRol sea un número
  });
};

/**
 * Elimina un trabajador (eliminación física).
 * @param id ID del trabajador a eliminar.
 * @returns Una promesa que resuelve con la respuesta de la API.
 */
export const deleteTrabajador = async (id: number) => {
  return axios.delete(`${API}/trabajadores/${id}`);
};

/**
 * Inhabilita un trabajador (soft delete).
 * @param id ID del trabajador a inhabilitar.
 * @returns Una promesa que resuelve con la respuesta de la API.
*/
export const disableTrabajador = async (id: number) => {
  return axios.put(`${API}/trabajadores/inhabilitar/${id}`);
};

/**
 * Habilita un trabajador.
 * @param id ID del trabajador a habilitar.
 * @returns Una promesa que resuelve con la respuesta de la API.
 */
export const enableTrabajador = async (id: number) => {
  return axios.put(`${API}/trabajadores/habilitar/${id}`);
};

/**
 * Obtiene todos los roles disponibles.
 * @returns Una promesa que resuelve con la lista de roles.
 */
export const getRoles = async (): Promise<Rol[]> => {
  const res = await axios.get<Rol[]>(`${API}/roles`);
  return res.data;
};

/**
 * Obtiene la lista de trabajadores con el rol 'Líder'.
 * @returns Una lista de objetos Trabajador.
 */
export const getLeaders = async (): Promise<Trabajador[]> => {
  const res = await axios.get<Trabajador[]>(`${API}/trabajadores/leaders`);
  return res.data;
};

/**
 * Obtiene la lista de trabajadores con el rol 'Desarrollador'.
 * @returns Una lista de objetos Trabajador.
 */
export const getDevelopers = async (): Promise<Trabajador[]> => {
  const res = await axios.get<Trabajador[]>(`${API}/trabajadores/developers`);
  return res.data;
};
