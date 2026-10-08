import React, { useEffect, useRef, useState } from "react";
import { MapOptions, MapTileInput, TerrainTypeOption } from "../../models/map";
import { addMap, getMapErrors, getMapOptions } from "../../services/map-service";

/** Value of the creator dropdown that switches to the free-text author name. */
const CUSTOMER = "customer";

/** Tile quantities are keyed by terrain type and size, so a type/size pair can only ever appear once. */
const cellKey = (terrainTypeId: number, terrainSizeId: number) => `${terrainTypeId}-${terrainSizeId}`;

/** A type with no listed sizes comes in every size. */
const isSizeAllowed = (type: TerrainTypeOption, terrainSizeId: number) =>
    type.allowedSizeIds.length === 0 || type.allowedSizeIds.includes(terrainSizeId);

/** An empty cell counts as 0. Returns NaN for anything that isn't a whole number of 0 or more. */
const parseQuantity = (value: string | undefined): number => {
    if (value === undefined || value.trim() === "") return 0;
    const quantity = Number(value);
    return Number.isInteger(quantity) && quantity >= 0 ? quantity : NaN;
};

const UploadMap: React.FC = () => {
    const [options, setOptions] = useState<MapOptions | null>(null);
    const [loadError, setLoadError] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [creator, setCreator] = useState<string>("");
    const [customerName, setCustomerName] = useState<string>("");
    const [playerCount, setPlayerCount] = useState<string>("");
    const [quantities, setQuantities] = useState<Record<string, string>>({});
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [status, setStatus] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        getMapOptions()
            .then(setOptions)
            .catch(() => setLoadError("Unable to load creators and terrain options."));
    }, []);

    const setQuantity = (terrainTypeId: number, terrainSizeId: number, value: string) => {
        setQuantities(current => ({ ...current, [cellKey(terrainTypeId, terrainSizeId)]: value }));
    };

    const quantityOf = (terrainTypeId: number, terrainSizeId: number) =>
        parseQuantity(quantities[cellKey(terrainTypeId, terrainSizeId)]);

    /** Sum of the valid cells; invalid cells are flagged in the grid and rejected on submit. */
    const sumOf = (cells: Array<[number, number]>) =>
        cells.reduce((total, [typeId, sizeId]) => {
            const quantity = quantityOf(typeId, sizeId);
            return Number.isNaN(quantity) ? total : total + quantity;
        }, 0);

    const resetForm = () => {
        setName("");
        setCreator("");
        setCustomerName("");
        setPlayerCount("");
        setQuantities({});
        setPdfFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setThumbnailFile(null);
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = "";
        }
    };

    /** The grid's non-empty cells as tiles, in size-then-type order. */
    const buildTiles = (current: MapOptions): MapTileInput[] => {
        const tiles: MapTileInput[] = [];
        for (const size of current.terrainSizes) {
            for (const type of current.terrainTypes) {
                const quantity = quantityOf(type.id, size.id);
                if (quantity > 0) {
                    tiles.push({ terrainTypeId: type.id, terrainSizeId: size.id, quantity });
                }
            }
        }
        return tiles;
    };

    const validate = (current: MapOptions): string[] => {
        const problems: string[] = [];
        if (!name.trim()) problems.push("Map name is required.");
        if (!creator) problems.push("Select a map creator or Custom.");
        if (creator === CUSTOMER && !customerName.trim()) problems.push("Enter the author's name.");
        const players = Number(playerCount);
        if (!Number.isInteger(players) || players < 1) problems.push("Number of players must be a whole number of at least 1.");
        const hasInvalidQuantity = current.terrainTypes.some(type =>
            current.terrainSizes.some(size => Number.isNaN(quantityOf(type.id, size.id))));
        if (hasInvalidQuantity) problems.push("Tile quantities must be whole numbers of 0 or more.");
        else if (buildTiles(current).length === 0) problems.push("Enter a quantity for at least one tile.");
        if (!pdfFile) problems.push("Select a PDF to upload.");
        if (!thumbnailFile) problems.push("Select a thumbnail image to upload.");
        return problems;
    };

    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("");
        if (!options) return;

        const problems = validate(options);
        setErrors(problems);
        if (problems.length > 0 || !pdfFile || !thumbnailFile) return;

        setUploading(true);
        try {
            const saved = await addMap({
                name: name.trim(),
                creatorId: creator === CUSTOMER ? null : Number(creator),
                customerName: customerName.trim(),
                playerCount: Number(playerCount),
                tiles: buildTiles(options),
                file: pdfFile,
                thumbnail: thumbnailFile,
            });
            setStatus(`Map "${saved.name}" uploaded successfully.`);
            setErrors([]);
            resetForm();
        } catch (uploadError) {
            const serverErrors = getMapErrors(uploadError);
            setErrors(serverErrors.length > 0 ? serverErrors : ["Failed to upload the map. Please try again."]);
        } finally {
            setUploading(false);
        }
    };

    if (loadError) return <div className="alert alert-danger" role="alert">{loadError}</div>;
    if (!options) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;

    const { terrainTypes, terrainSizes } = options;
    const allCells = terrainTypes.flatMap(type => terrainSizes.map((size): [number, number] => [type.id, size.id]));

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-xl-10">
                    <h2 className="mb-4">Upload Map</h2>
                    <form className="row g-3" onSubmit={handleUpload}>
                        <div className="col-12">
                            <label htmlFor="mapName" className="form-label">Map Name <span className="text-danger">*</span></label>
                            <input id="mapName" type="text" className="form-control" maxLength={200}
                                value={name} onChange={e => setName(e.target.value)} />
                        </div>

                        <div className="col-12 col-md-6">
                            <label htmlFor="mapCreator" className="form-label">Map Creator <span className="text-danger">*</span></label>
                            <select id="mapCreator" className="form-select" value={creator} onChange={e => setCreator(e.target.value)}>
                                <option value="">Select Creator</option>
                                {options.creators.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                                <option value={CUSTOMER}>Custom</option>
                            </select>
                        </div>

                        {creator === CUSTOMER && (
                            <div className="col-12 col-md-6">
                                <label htmlFor="customerName" className="form-label">Author's Name <span className="text-danger">*</span></label>
                                <input id="customerName" type="text" className="form-control" maxLength={200}
                                    value={customerName} onChange={e => setCustomerName(e.target.value)} />
                            </div>
                        )}

                        <div className="col-12 col-md-6">
                            <label htmlFor="playerCount" className="form-label">Number of Players <span className="text-danger">*</span></label>
                            <input id="playerCount" type="number" min={1} step={1} className="form-control"
                                value={playerCount} onChange={e => setPlayerCount(e.target.value)} />
                        </div>

                        <div className="col-12">
                            <label className="form-label">
                                Tiles Needed <span className="text-danger">*</span>
                                <span className="text-muted ms-2">Type a quantity in each cell the map uses; leave the rest blank.</span>
                            </label>
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered align-middle text-center mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-start">Terrain</th>
                                            {terrainSizes.map(size => (
                                                <th scope="col" key={size.id}>{size.name}</th>
                                            ))}
                                            <th scope="col">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {terrainTypes.map(type => (
                                            <tr key={type.id}>
                                                <th scope="row" className="text-start fw-normal">{type.name}</th>
                                                {terrainSizes.map(size => {
                                                    if (!isSizeAllowed(type, size.id)) {
                                                        return (
                                                            <td key={size.id} className="bg-light text-muted" title={`${type.name} doesn't come in ${size.name}`}>
                                                                &mdash;
                                                            </td>
                                                        );
                                                    }
                                                    const key = cellKey(type.id, size.id);
                                                    const invalid = Number.isNaN(quantityOf(type.id, size.id));
                                                    return (
                                                        <td key={size.id} className="p-1">
                                                            <input type="number" min={0} step={1}
                                                                className={`form-control form-control-sm text-center ${invalid ? "is-invalid" : ""}`}
                                                                style={{ minWidth: "4rem" }}
                                                                aria-label={`${type.name}, ${size.name}`}
                                                                value={quantities[key] ?? ""}
                                                                onChange={e => setQuantity(type.id, size.id, e.target.value)} />
                                                        </td>
                                                    );
                                                })}
                                                <td className="fw-bold">{sumOf(terrainSizes.map((size): [number, number] => [type.id, size.id]))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th scope="row" className="text-start">Total</th>
                                            {terrainSizes.map(size => (
                                                <td key={size.id} className="fw-bold">
                                                    {sumOf(terrainTypes.map((type): [number, number] => [type.id, size.id]))}
                                                </td>
                                            ))}
                                            <td className="fw-bold">{sumOf(allCells)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <div className="col-12">
                            <label htmlFor="mapPdf" className="form-label">Map PDF <span className="text-danger">*</span></label>
                            <input ref={fileInputRef} id="mapPdf" type="file" className="form-control" accept="application/pdf"
                                onChange={e => setPdfFile(e.target.files?.[0] ?? null)} />
                        </div>

                        <div className="col-12">
                            <label htmlFor="mapThumbnail" className="form-label">Thumbnail Image <span className="text-danger">*</span></label>
                            <input ref={thumbnailInputRef} id="mapThumbnail" type="file" className="form-control" accept="image/png,image/jpeg"
                                onChange={e => setThumbnailFile(e.target.files?.[0] ?? null)} />
                        </div>

                        {errors.length > 0 && (
                            <div className="col-12">
                                <div className="alert alert-danger" role="alert">
                                    <ul className="mb-0">
                                        {errors.map(message => <li key={message}>{message}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )}
                        {status && (
                            <div className="col-12">
                                <div className="alert alert-success" role="alert">{status}</div>
                            </div>
                        )}
                        <div className="col-12">
                            <button className="btn btn-primary" type="submit" disabled={uploading}>
                                {uploading ? "Uploading..." : "Upload Map"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadMap;
