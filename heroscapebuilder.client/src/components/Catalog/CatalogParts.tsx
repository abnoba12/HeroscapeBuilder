import React from 'react';
import { Link } from 'react-router-dom';
import { HubAccent, HubCrumb } from '../HubCards/HubCards';
import { Unit } from '../../models/unit';
import { getPrimaryImage, unitPath } from '../../services/catalog';
import './catalog.scss';

interface CatalogShellProps {
    accent: HubAccent;
    title: string;
    intro?: React.ReactNode;
    crumbs: HubCrumb[];
    badges?: string[];
    children: React.ReactNode;
}

/** The shared banner + body layout for the unit / species / general / set pages. */
export const CatalogShell: React.FC<CatalogShellProps> = ({ accent, title, intro, crumbs, badges, children }) => (
    <div className={`hub hub-${accent} catalog`}>
        <header className="hub-banner">
            <nav className="hub-crumbs" aria-label="Breadcrumb">
                {crumbs.map((crumb, i) => (
                    <React.Fragment key={`${crumb.label}-${i}`}>
                        {i > 0 && <span className="hub-crumb-sep">/</span>}
                        {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                    </React.Fragment>
                ))}
            </nav>
            <h1>{title}</h1>
            {intro && <p className="hub-intro">{intro}</p>}
            {badges && badges.length > 0 && (
                <div className="catalog-badges">
                    {badges.map(badge => <span key={badge} className="catalog-badge">{badge}</span>)}
                </div>
            )}
        </header>
        {children}
    </div>
);

export const CatalogLoading: React.FC = () => (
    <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>
);

export const CatalogMessage: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
    <div className="catalog-message">
        <h2>{title}</h2>
        {children}
    </div>
);

interface UnitTileProps {
    unit: Unit;
    points?: number;
    /** Extra line under the name, e.g. the species. Defaults to species and role. */
    subtitle?: string;
}

export const UnitTile: React.FC<UnitTileProps> = ({ unit, points, subtitle }) => {
    const image = getPrimaryImage(unit);
    const line = subtitle ?? [unit.race, unit.role].filter(Boolean).join(' - ');

    return (
        <Link to={unitPath(unit)} className="catalog-tile">
            <div className="catalog-tile-art">
                {image
                    ? <img src={image} alt={`${unit.name} army card`} loading="lazy" decoding="async" />
                    : <span className="catalog-tile-noimage" aria-hidden="true">&#x2B21;</span>}
            </div>
            <div className="catalog-tile-name">{unit.name}</div>
            {line && <div className="catalog-tile-sub">{line}</div>}
            <div className="catalog-tile-stats">
                {unit.life != null && <span title="Life">{unit.life} Life</span>}
                {points != null && <span title="Points">{points} pts</span>}
            </div>
        </Link>
    );
};

export const UnitGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="catalog-grid">{children}</div>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id }) => (
    <h2 className="catalog-section-title" id={id}>{children}</h2>
);
