import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../components/CardGallery/card-gallery.scss";
import { getCreatorInfo } from "../../models/creator";
import { getMapAuthor, MapOptions, MapSummary, mapPath } from "../../models/map";
import { hasRole } from "../../services/authService";
import ImageCache from "../../services/image-cache-service";
import { deleteMap, getMapOptions, getMaps } from "../../services/map-service";
import { useUrlParam } from "../../services/url-state";
import "./map-list.scss";

/** Value of the creator filter that matches maps by free-text authors. */
const CUSTOM = "custom";

const SORTS = {
    newest: "Newest",
    name: "Name (A-Z)",
    players: "Players (fewest first)",
    tilesLow: "Tiles (fewest first)",
    tilesHigh: "Tiles (most first)",
} as const;
type SortKey = keyof typeof SORTS;

const compareNames = (a: MapSummary, b: MapSummary) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" });

const SORTERS: Record<SortKey, (a: MapSummary, b: MapSummary) => number> = {
    newest: (a, b) => b.createdAt.localeCompare(a.createdAt) || compareNames(a, b),
    name: compareNames,
    players: (a, b) => a.playerCount - b.playerCount || compareNames(a, b),
    tilesLow: (a, b) => a.tileCount - b.tileCount || compareNames(a, b),
    tilesHigh: (a, b) => b.tileCount - a.tileCount || compareNames(a, b),
};

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

const MapList: React.FC = () => {
    const [maps, setMaps] = useState<MapSummary[]>([]);
    const [options, setOptions] = useState<MapOptions | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [search, setSearch] = useUrlParam("q");
    const [creator, setCreator] = useUrlParam("creator");
    const [players, setPlayers] = useUrlParam("players");
    const [terrain, setTerrain] = useUrlParam("terrain");
    const [sortParam, setSort] = useUrlParam("sort", "newest");
    const sort: SortKey = sortParam in SORTS ? (sortParam as SortKey) : "newest";
    const isAdmin = hasRole("Admin");

    useEffect(() => {
        Promise.all([getMaps(), getMapOptions()])
            .then(([loadedMaps, loadedOptions]) => {
                setMaps(loadedMaps);
                setOptions(loadedOptions);
            })
            .catch(() => setError("Unable to load maps."))
            .finally(() => setLoading(false));
    }, []);

    // Only offer creators, player counts and terrain that at least one map has, so no choice leads to an empty page.
    const creatorChoices = useMemo(() => {
        const byId = new Map<number, string>();
        maps.forEach(m => { if (m.creatorId !== null && m.creatorName) byId.set(m.creatorId, m.creatorName); });
        return Array.from(byId, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    }, [maps]);
    const hasCustomAuthors = useMemo(() => maps.some(m => m.creatorId === null), [maps]);
    const playerChoices = useMemo(() => Array.from(new Set(maps.map(m => m.playerCount))).sort((a, b) => a - b), [maps]);
    const terrainChoices = useMemo(() => {
        const used = new Set(maps.flatMap(m => m.tiles.map(t => t.terrainTypeId)));
        return (options?.terrainTypes ?? []).filter(t => used.has(t.id));
    }, [maps, options]);
    const terrainNames = useMemo(() => new Map((options?.terrainTypes ?? []).map(t => [t.id, t.name])), [options]);

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase();
        return maps
            .filter(m => !needle || m.name.toLowerCase().includes(needle) || getMapAuthor(m).toLowerCase().includes(needle))
            .filter(m => !creator || (creator === CUSTOM ? m.creatorId === null : String(m.creatorId) === creator))
            .filter(m => !players || String(m.playerCount) === players)
            .filter(m => !terrain || m.tiles.some(t => String(t.terrainTypeId) === terrain))
            .sort(SORTERS[sort]);
    }, [maps, search, creator, players, terrain, sort]);

    const hasFilters = !!(search || creator || players || terrain);
    const clearFilters = () => {
        setSearch("");
        setCreator("");
        setPlayers("");
        setTerrain("");
    };

    const handleDelete = async (map: MapSummary) => {
        if (!window.confirm(`Delete "${map.name}"? This removes the map and its files and cannot be undone.`)) return;
        try {
            await deleteMap(map.id);
            setMaps(current => current.filter(m => m.id !== map.id));
        } catch {
            window.alert("Failed to delete the map. Please try again.");
        }
    };

    if (loading) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;
    if (error) return <div className="alert alert-danger" role="alert">{error}</div>;

    return (
        <div className="map-list">
            <div className="row map-filters g-3">
                <div className="col-12 col-md-6 col-xl-3">
                    <label htmlFor="mapSearch" className="form-label">Search</label>
                    <input id="mapSearch" type="search" className="form-control" placeholder="Map name or author"
                        value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="col-6 col-md-3 col-xl-2">
                    <label htmlFor="mapCreatorFilter" className="form-label">Creator</label>
                    <select id="mapCreatorFilter" className="form-select" value={creator} onChange={e => setCreator(e.target.value)}>
                        <option value="">All Creators</option>
                        {creatorChoices.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        {hasCustomAuthors && <option value={CUSTOM}>Custom</option>}
                    </select>
                </div>
                <div className="col-6 col-md-3 col-xl-2">
                    <label htmlFor="mapPlayersFilter" className="form-label">Players</label>
                    <select id="mapPlayersFilter" className="form-select" value={players} onChange={e => setPlayers(e.target.value)}>
                        <option value="">Any</option>
                        {playerChoices.map(count => <option key={count} value={count}>{count}</option>)}
                    </select>
                </div>
                <div className="col-6 col-md-6 col-xl-3">
                    <label htmlFor="mapTerrainFilter" className="form-label">Uses Terrain</label>
                    <select id="mapTerrainFilter" className="form-select" value={terrain} onChange={e => setTerrain(e.target.value)}>
                        <option value="">Any</option>
                        {terrainChoices.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div className="col-6 col-md-6 col-xl-2">
                    <label htmlFor="mapSort" className="form-label">Sort By</label>
                    <select id="mapSort" className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
                        {(Object.keys(SORTS) as SortKey[]).map(key => <option key={key} value={key}>{SORTS[key]}</option>)}
                    </select>
                </div>
            </div>

            <div className="result-count">
                Showing {filtered.length} of {plural(maps.length, "map")}
                {hasFilters && <button type="button" className="btn btn-link btn-sm" onClick={clearFilters}>Clear filters</button>}
                {isAdmin && <Link to="/maps/upload" className="btn btn-primary btn-sm ms-2">Upload Map</Link>}
            </div>

            {filtered.length === 0 && <p className="text-center">No maps match these filters.</p>}

            <div className="row pdf-gallery">
                {filtered.map(map => {
                    const creatorInfo = getCreatorInfo(map.creatorAbbreviation);
                    const author = getMapAuthor(map);
                    const terrainList = Array.from(new Set(map.tiles.map(t => terrainNames.get(t.terrainTypeId)).filter(Boolean))).join(", ");
                    return (
                        <div key={map.id} className="thumbnail col-xl-2 col-lg-3 col-md-4">
                            <Link className="thumbnail-image-link" to={mapPath(map)}>
                                <ImageCache className="img-fluid" src={map.thumbnailPath} alt={`${map.name} map thumbnail`} />
                            </Link>
                            <Link className="unit-name" to={mapPath(map)} title={map.name}>{map.name}</Link>
                            <div className="map-author" title={creatorInfo?.label ?? author}>
                                {creatorInfo && <img src={creatorInfo.logo} alt={creatorInfo.label} />}
                                <span>{author}</span>
                            </div>
                            <div className="map-stats" title={terrainList}>
                                {plural(map.playerCount, "player")} &middot; {plural(map.tileCount, "tile")} &middot; {plural(map.spaceCount, "space")}
                            </div>
                            <div className="map-admin-actions">
                                <a href={map.filePath} className="btn btn-sm btn-primary" target="_blank" rel="noopener noreferrer" download>Download</a>
                                {isAdmin && (
                                    <>
                                        <Link to={`/maps/${map.id}/edit`} className="btn btn-sm btn-outline-primary">Edit</Link>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(map)}>Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MapList;
