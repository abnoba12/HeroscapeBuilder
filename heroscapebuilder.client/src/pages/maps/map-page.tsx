import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CatalogLoading, CatalogMessage, CatalogShell, SectionTitle } from '../../components/Catalog/CatalogParts';
import PageMeta from '../../components/Seo/PageMeta';
import { getCreatorInfo } from '../../models/creator';
import { getMapAuthor, MapOptions, MapSummary, mapPath } from '../../models/map';
import { hasRole } from '../../services/authService';
import { deleteMap, getMapOptions, getMaps } from '../../services/map-service';

import './map-page.scss';

const RELATED_LIMIT = 12;

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

const Stat: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
    <div className="unit-stat">
        <div className="unit-stat-value">{value}</div>
        <div className="unit-stat-label">{label}</div>
    </div>
);

const DetailRow: React.FC<{ label: string; children?: React.ReactNode }> = ({ label, children }) => (
    children == null || children === '' ? null : <tr><th scope="row">{label}</th><td>{children}</td></tr>
);

const MapTile: React.FC<{ map: MapSummary }> = ({ map }) => (
    <Link to={mapPath(map)} className="catalog-tile">
        <div className="catalog-tile-art">
            <img src={map.thumbnailPath} alt={`${map.name} map`} loading="lazy" decoding="async" />
        </div>
        <div className="catalog-tile-name">{map.name}</div>
        <div className="catalog-tile-sub">{getMapAuthor(map)}</div>
        <div className="catalog-tile-stats">
            <span>{plural(map.playerCount, 'player')}</span>
            <span>{plural(map.tileCount, 'tile')}</span>
        </div>
    </Link>
);

const MapPageContent: React.FC<{ map: MapSummary; maps: MapSummary[]; options: MapOptions }> = ({ map, maps, options }) => {
    const navigate = useNavigate();
    const isAdmin = hasRole('Admin');
    const creator = getCreatorInfo(map.creatorAbbreviation);
    const author = getMapAuthor(map);

    // Sizes and types this map actually uses; the grid skips the rest so it stays readable.
    const sizes = options.terrainSizes.filter(size => map.tiles.some(t => t.terrainSizeId === size.id));
    const types = options.terrainTypes.filter(type => map.tiles.some(t => t.terrainTypeId === type.id));
    const quantity = (typeId: number, sizeId: number) =>
        map.tiles.find(t => t.terrainTypeId === typeId && t.terrainSizeId === sizeId)?.quantity ?? 0;

    const related = useMemo(() => {
        const others = maps.filter(other => other.id !== map.id);
        const sameAuthor = others.filter(other => (map.creatorId !== null ? other.creatorId === map.creatorId : other.customerName === map.customerName));
        const samePlayers = others.filter(other => other.playerCount === map.playerCount && !sameAuthor.includes(other));
        return { sameAuthor: sameAuthor.slice(0, RELATED_LIMIT), samePlayers: samePlayers.slice(0, RELATED_LIMIT) };
    }, [maps, map]);

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${map.name}"? This removes the map and its files and cannot be undone.`)) return;
        try {
            await deleteMap(map.id);
            navigate('/maps');
        } catch {
            window.alert('Failed to delete the map. Please try again.');
        }
    };

    return (
        <CatalogShell
            accent="purple"
            title={map.name}
            intro={`${plural(map.playerCount, 'player')} map${author ? ` by ${author}` : ''}`}
            badges={[plural(map.playerCount, 'player'), plural(map.tileCount, 'tile')]}
            crumbs={[{ label: 'Home', to: '/' }, { label: 'Maps', to: '/maps' }, { label: map.name }]}
        >
            <div className="unit-layout">
                <aside>
                    <a className="unit-art" href={map.filePath} target="_blank" rel="noopener noreferrer">
                        <img src={map.thumbnailPath} alt={`${map.name} Heroscape map`} />
                        <div className="unit-art-caption">Click to open the full map PDF</div>
                    </a>
                </aside>

                <div>
                    <div className="unit-stats">
                        <Stat label="Players" value={map.playerCount} />
                        <Stat label="Tiles" value={map.tileCount} />
                        <Stat label="Spaces" value={map.spaceCount} />
                        <Stat label="Terrain Types" value={types.length} />
                    </div>

                    <div className="map-page-actions">
                        <a className="catalog-btn catalog-btn-primary" href={map.filePath} target="_blank" rel="noopener noreferrer" download>
                            Download Map PDF
                        </a>
                        {isAdmin && <Link className="catalog-btn" to={`/maps/${map.id}/edit`}>Edit</Link>}
                        {isAdmin && <button type="button" className="catalog-btn" onClick={handleDelete}>Delete</button>}
                    </div>

                    <SectionTitle>Map Details</SectionTitle>
                    <table className="unit-details">
                        <tbody>
                            <DetailRow label="Players">{map.playerCount}</DetailRow>
                            <DetailRow label="Creator">{creator?.label ?? map.creatorName}</DetailRow>
                            <DetailRow label="Author">{map.creatorId === null ? map.customerName : null}</DetailRow>
                            <DetailRow label="Total tiles">{map.tileCount}</DetailRow>
                            <DetailRow label="Total spaces">{map.spaceCount}</DetailRow>
                            <DetailRow label="Terrain">{types.map(t => t.name).join(', ')}</DetailRow>
                            <DetailRow label="Added">{new Date(map.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</DetailRow>
                        </tbody>
                    </table>
                </div>
            </div>

            <SectionTitle>Tiles Needed</SectionTitle>
            <div className="table-responsive">
                <table className="table table-sm table-bordered align-middle text-center">
                    <thead>
                        <tr>
                            <th scope="col" className="text-start">Terrain</th>
                            {sizes.map(size => <th scope="col" key={size.id}>{size.name}</th>)}
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {types.map(type => (
                            <tr key={type.id}>
                                <th scope="row" className="text-start fw-normal">{type.name}</th>
                                {sizes.map(size => {
                                    const count = quantity(type.id, size.id);
                                    return <td key={size.id} className={count ? '' : 'text-muted'}>{count || '—'}</td>;
                                })}
                                <td className="fw-bold">{sizes.reduce((sum, size) => sum + quantity(type.id, size.id), 0)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" className="text-start">Total</th>
                            {sizes.map(size => (
                                <td key={size.id} className="fw-bold">{types.reduce((sum, type) => sum + quantity(type.id, size.id), 0)}</td>
                            ))}
                            <td className="fw-bold">{map.tileCount}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {related.sameAuthor.length > 0 && (
                <>
                    <SectionTitle>More Maps by {author}</SectionTitle>
                    <div className="catalog-grid">{related.sameAuthor.map(other => <MapTile key={other.id} map={other} />)}</div>
                </>
            )}

            {related.samePlayers.length > 0 && (
                <>
                    <SectionTitle>More {plural(map.playerCount, 'Player')} Maps</SectionTitle>
                    <div className="catalog-grid">{related.samePlayers.map(other => <MapTile key={other.id} map={other} />)}</div>
                </>
            )}

            <div className="catalog-chips mt-4">
                <Link className="catalog-chip" to="/maps">Browse all maps</Link>
            </div>
        </CatalogShell>
    );
};

const MapPage: React.FC = () => {
    const { idSlug } = useParams<{ idSlug: string }>();
    const id = Number.parseInt(idSlug ?? '', 10);
    const [data, setData] = useState<{ maps: MapSummary[]; options: MapOptions } | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        Promise.all([getMaps(), getMapOptions()])
            .then(([maps, options]) => setData({ maps, options }))
            .catch(() => setError(true));
    }, []);

    if (error) {
        return <PageMeta title="Map" description="Heroscape map" noindex><CatalogMessage title="Could not load this map.">Please try again in a moment.</CatalogMessage></PageMeta>;
    }
    if (!data) {
        return <PageMeta title="Heroscape Map" description="Heroscape map tile list and printable build guide."><CatalogLoading /></PageMeta>;
    }

    const map = Number.isInteger(id) ? data.maps.find(m => m.id === id) : undefined;
    if (!map) {
        return (
            <PageMeta title="Map Not Found" description="That Heroscape map could not be found." noindex>
                <CatalogMessage title="We couldn't find that map.">
                    <Link to="/maps">Browse the maps</Link>
                </CatalogMessage>
            </PageMeta>
        );
    }

    const author = getMapAuthor(map);
    return (
        <PageMeta
            title={`${map.name} - Heroscape Map`}
            description={`${map.name}, a ${map.playerCount}-player Heroscape map${author ? ` by ${author}` : ''}. Needs ${map.tileCount} tiles. Download the printable PDF.`}
            canonicalPath={mapPath(map)}
            image={map.thumbnailPath}
        >
            <MapPageContent map={map} maps={data.maps} options={data.options} />
        </PageMeta>
    );
};

export default MapPage;
