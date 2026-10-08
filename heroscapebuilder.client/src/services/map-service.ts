import { MapOptions, MapSummary, MapUploadInput } from '../models/map';
import AxiosSingletonService from './AxiosSingletonService';

const api = AxiosSingletonService.getInstance();

export async function getMapOptions(): Promise<MapOptions> {
    return (await api.get<MapOptions>('/Map/GetOptions')).data;
}

export async function addMap(input: MapUploadInput): Promise<MapSummary> {
    const formData = new FormData();
    formData.append('name', input.name);
    if (input.creatorId !== null) {
        formData.append('creatorId', String(input.creatorId));
    } else {
        formData.append('customerName', input.customerName);
    }
    formData.append('playerCount', String(input.playerCount));
    formData.append('tiles', JSON.stringify(input.tiles));
    formData.append('file', input.file);
    formData.append('thumbnail', input.thumbnail);

    // The shared axios instance defaults to JSON; let the browser set the multipart boundary.
    return (await api.post<MapSummary>('/Map/AddMap', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })).data;
}

/** Pulls the validation messages out of an AddMap error response. */
export function getMapErrors(error: unknown): string[] {
    const errors = (error as { response?: { data?: { errors?: unknown } } })?.response?.data?.errors;
    return Array.isArray(errors) ? errors.map(String) : [];
}
