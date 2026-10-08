import { MapOptions, MapSummary, MapUpdateInput, MapUploadInput } from '../models/map';
import AxiosSingletonService from './AxiosSingletonService';

const api = AxiosSingletonService.getInstance();

export async function getMapOptions(): Promise<MapOptions> {
    return (await api.get<MapOptions>('/Map/GetOptions')).data;
}

/** The multipart form shared by AddMap and UpdateMap. */
function buildMapForm(input: MapUpdateInput): FormData {
    const formData = new FormData();
    formData.append('name', input.name);
    if (input.creatorId !== null) {
        formData.append('creatorId', String(input.creatorId));
    } else {
        formData.append('customerName', input.customerName);
    }
    formData.append('playerCount', String(input.playerCount));
    formData.append('tiles', JSON.stringify(input.tiles));
    if (input.file) formData.append('file', input.file);
    if (input.thumbnail) formData.append('thumbnail', input.thumbnail);
    return formData;
}

// The shared axios instance defaults to JSON; let the browser set the multipart boundary.
const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

export async function addMap(input: MapUploadInput): Promise<MapSummary> {
    return (await api.post<MapSummary>('/Map/AddMap', buildMapForm(input), multipart)).data;
}

export async function getMaps(): Promise<MapSummary[]> {
    return (await api.get<MapSummary[]>('/Map/GetMaps')).data;
}

export async function getMap(id: number): Promise<MapSummary> {
    return (await api.get<MapSummary>('/Map/GetMap', { params: { id } })).data;
}

export async function updateMap(id: number, input: MapUpdateInput): Promise<MapSummary> {
    return (await api.put<MapSummary>('/Map/UpdateMap', buildMapForm(input), { ...multipart, params: { id } })).data;
}

export async function deleteMap(id: number): Promise<void> {
    await api.delete('/Map/DeleteMap', { params: { id } });
}

/** Pulls the validation messages out of an AddMap error response. */
export function getMapErrors(error: unknown): string[] {
    const errors = (error as { response?: { data?: { errors?: unknown } } })?.response?.data?.errors;
    return Array.isArray(errors) ? errors.map(String) : [];
}
