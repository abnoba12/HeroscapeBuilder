import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapOptions, TerrainTypeOption } from "../../models/map";
import { getMapOptions } from "../../services/map-service";
import { getMyTerrain, setMyTerrain } from "../../services/my-terrain-service";

const MAX_QUANTITY = 10000;

const keyOf = (typeId: number, sizeId: number) => `${typeId}:${sizeId}`;

/** Lets a user record how many of each terrain type and size they own. */
const MyTerrain: React.FC = () => {
    const [options, setOptions] = useState<MapOptions | null>(null);
    const [saved, setSaved] = useState<Record<string, number>>({});
    const [draft, setDraft] = useState<Record<string, number>>({});
    const [addedTypeIds, setAddedTypeIds] = useState<number[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);
    const typeToFocus = useRef<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const toRecord = (items: { terrainTypeId: number; terrainSizeId: number; quantity: number }[]) =>
        Object.fromEntries(items.map(i => [keyOf(i.terrainTypeId, i.terrainSizeId), i.quantity]));

    useEffect(() => {
        Promise.all([getMapOptions(), getMyTerrain()])
            .then(([loadedOptions, terrain]) => {
                setOptions(loadedOptions);
                const record = toRecord(terrain);
                setSaved(record);
                setDraft(record);
                setAddedTypeIds(Array.from(new Set(terrain.map(t => t.terrainTypeId))));
            })
            .catch(() => setError("Unable to load your terrain."))
            .finally(() => setLoading(false));
    }, []);

    const dirty = useMemo(() => {
        const keys = new Set([...Object.keys(saved), ...Object.keys(draft)]);
        return Array.from(keys).some(k => (saved[k] ?? 0) !== (draft[k] ?? 0));
    }, [saved, draft]);

    const total = useMemo(() => Object.values(draft).reduce((sum, q) => sum + q, 0), [draft]);

    // Warn before leaving with unsaved changes.
    useEffect(() => {
        if (!dirty) return;
        const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [dirty]);

    // Focus the first quantity box of a newly added row.
    useEffect(() => {
        const typeId = typeToFocus.current;
        if (typeId === null) return;
        typeToFocus.current = null;
        gridRef.current?.querySelector<HTMLInputElement>(`input[data-type-id="${typeId}"]`)?.focus();
    }, [addedTypeIds]);

    const addType = (typeId: number) => {
        typeToFocus.current = typeId;
        setAddedTypeIds(current => (current.includes(typeId) ? current : [...current, typeId]));
    };

    /** Removing a row also clears its quantities, so nothing hidden is saved. */
    const removeType = (typeId: number) => {
        setAddedTypeIds(current => current.filter(id => id !== typeId));
        setMessage("");
        setDraft(current => Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(`${typeId}:`))));
    };

    const setQuantity = (typeId: number, sizeId: number, raw: string) => {
        const parsed = Math.min(MAX_QUANTITY, Math.max(0, parseInt(raw, 10) || 0));
        setMessage("");
        setDraft(current => ({ ...current, [keyOf(typeId, sizeId)]: parsed }));
    };

    const discard = () => {
        setDraft(saved);
        setMessage("");
        setAddedTypeIds(Array.from(new Set(Object.keys(saved).map(k => Number(k.split(":")[0])))));
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setMessage("");
        try {
            const items = Object.entries(draft)
                .filter(([, quantity]) => quantity > 0)
                .map(([key, quantity]) => {
                    const [terrainTypeId, terrainSizeId] = key.split(":").map(Number);
                    return { terrainTypeId, terrainSizeId, quantity };
                });
            const result = toRecord(await setMyTerrain(items));
            setSaved(result);
            setDraft(result);
            setAddedTypeIds(current => Array.from(new Set([...current, ...Object.keys(result).map(k => Number(k.split(":")[0]))])));
            setMessage("Terrain saved.");
        } catch {
            setError("Failed to save your terrain. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;
    if (!options) return <div className="alert alert-danger" role="alert">{error || "Unable to load terrain options."}</div>;

    const addedTypes = addedTypeIds
        .map(id => options.terrainTypes.find(t => t.id === id))
        .filter((t): t is TerrainTypeOption => t !== undefined);
    const availableTypes = options.terrainTypes.filter(t => !addedTypeIds.includes(t.id));
    const typeTotal = (typeId: number) =>
        options.terrainSizes.reduce((sum, size) => sum + (draft[keyOf(typeId, size.id)] ?? 0), 0);

    return (
        <div className="my-terrain">
            <p>
                Add each terrain type you own, then type a quantity in the sizes you have.
                The Maps page can then show only the maps you have the terrain to build.
            </p>

            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {message && <div className="alert alert-success" role="status">{message}</div>}

            <select className="form-select mb-2" style={{ maxWidth: "20rem" }} aria-label="Add a terrain type"
                value="" disabled={availableTypes.length === 0}
                onChange={e => { if (e.target.value) addType(Number(e.target.value)); }}>
                <option value="">{availableTypes.length === 0 ? "All terrain types added" : "+ Add a terrain type"}</option>
                {availableTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
            </select>
            {addedTypes.length === 0 && <div className="text-muted fst-italic mb-3">No terrain types added yet.</div>}

            <div className="table-responsive mb-3" ref={gridRef} hidden={addedTypes.length === 0}>
                <table className="table table-sm table-striped table-bordered align-middle text-center mb-0">
                    <thead>
                        <tr>
                            <th scope="col" className="text-start">Terrain</th>
                            {options.terrainSizes.map(s => <th scope="col" key={s.id}>{s.name}</th>)}
                            <th scope="col">Total</th>
                            <th scope="col"><span className="visually-hidden">Remove</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {addedTypes.map(type => (
                            <tr key={type.id}>
                                <th scope="row" className="text-start fw-normal">{type.name}</th>
                                {options.terrainSizes.map(size => {
                                    const allowed = type.allowedSizeIds.length === 0 || type.allowedSizeIds.includes(size.id);
                                    if (!allowed) {
                                        return <td key={size.id} className="text-muted" title={`${type.name} doesn't come in ${size.name}`}>&mdash;</td>;
                                    }
                                    const value = draft[keyOf(type.id, size.id)] ?? 0;
                                    return (
                                        <td key={size.id} className="p-1">
                                            <input type="number" min={0} max={MAX_QUANTITY} step={1} data-type-id={type.id}
                                                className="form-control form-control-sm text-center" style={{ minWidth: "4rem" }}
                                                aria-label={`${type.name}, ${size.name}`}
                                                value={value === 0 ? "" : value}
                                                onChange={e => setQuantity(type.id, size.id, e.target.value)} />
                                        </td>
                                    );
                                })}
                                <td className="fw-bold">{typeTotal(type.id)}</td>
                                <td className="p-1">
                                    <button type="button" className="btn btn-sm btn-outline-danger"
                                        aria-label={`Remove ${type.name}`} title={`Remove ${type.name}`}
                                        onClick={() => removeType(type.id)}>&times;</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" className="text-start">Total</th>
                            {options.terrainSizes.map(size => (
                                <td key={size.id} className="fw-bold">
                                    {addedTypes.reduce((sum, type) => sum + (draft[keyOf(type.id, size.id)] ?? 0), 0)}
                                </td>
                            ))}
                            <td className="fw-bold">{total}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="d-flex align-items-center gap-3">
                <button type="button" className="btn btn-primary" disabled={!dirty || saving} onClick={handleSave}>
                    {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" className="btn btn-outline-secondary" disabled={!dirty || saving} onClick={discard}>
                    Discard changes
                </button>
                <span>{total} tile{total === 1 ? "" : "s"} total{dirty && " (unsaved changes)"}</span>
            </div>
        </div>
    );
};

export default MyTerrain;
