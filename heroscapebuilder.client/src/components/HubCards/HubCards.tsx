import React from 'react';
import { Link } from 'react-router-dom';
import "./HubCards.scss";

export type HubAccent = "green" | "blue" | "purple" | "orange" | "neutral";
export type HubLayout = "feature" | "showcase" | "steps";

export interface HubTile {
    to: string;
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
    cta?: string;
    accent?: HubAccent;
    // Showcase layout only: render as a full-width strip under the other tiles
    wide?: boolean;
}

export interface HubCrumb {
    label: string;
    to?: string;
}

interface HubPageProps {
    title: string;
    intro?: React.ReactNode;
    accent?: HubAccent;
    layout: HubLayout;
    tiles: HubTile[];
    crumbs?: HubCrumb[];
    children?: React.ReactNode;
}

const TileImage: React.FC<{ tile: HubTile }> = ({ tile }) => (
    <img src={tile.image} alt={tile.imageAlt ?? tile.title} loading="lazy" />
);

// Only tiles that give an explicit label show a call to action
const Cta: React.FC<{ tile: HubTile }> = ({ tile }) => (
    tile.cta ? <span className="hub-cta">{tile.cta} <span aria-hidden="true">&rarr;</span></span> : null
);

/** Gradient tile with the artwork bleeding off the right edge. */
const OverlayTile: React.FC<{ tile: HubTile; accent: HubAccent; className?: string }> = ({ tile, accent, className = "" }) => (
    <Link to={tile.to} className={`hub-overlay hub-${tile.accent ?? accent} ${className}`}>
        <div className="hub-overlay-text">
            <h2>{tile.title}</h2>
            <p>{tile.description}</p>
            <Cta tile={tile} />
        </div>
        <TileImage tile={tile} />
    </Link>
);

/** Shared layout for pages that only exist to send visitors somewhere else. */
export const HubPage: React.FC<HubPageProps> = ({ title, intro, accent = "neutral", layout, tiles, crumbs, children }) => {
    const wideTiles = tiles.filter(t => t.wide);
    const mainTiles = tiles.filter(t => !t.wide);

    return (
        <div className={`hub hub-${accent} hub-layout-${layout}`}>
            <header className="hub-banner">
                {crumbs && (
                    <nav className="hub-crumbs" aria-label="Breadcrumb">
                        {crumbs.map((crumb, i) => (
                            <React.Fragment key={crumb.label}>
                                {i > 0 && <span className="hub-crumb-sep">/</span>}
                                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                            </React.Fragment>
                        ))}
                    </nav>
                )}
                <h1>{title}</h1>
                {intro && <p className="hub-intro">{intro}</p>}
                {children}
            </header>

            {layout === "feature" && (
                <div className="hub-feature">
                    <div className="hub-feature-row hub-feature-top">
                        {mainTiles.slice(0, 2).map((tile, i) => (
                            <OverlayTile key={tile.to} tile={tile} accent={accent} className={i === 0 ? "hub-overlay-large" : ""} />
                        ))}
                    </div>
                    {mainTiles.length > 2 && (
                        <div className="hub-feature-row">
                            {mainTiles.slice(2).map(tile => <OverlayTile key={tile.to} tile={tile} accent={accent} />)}
                        </div>
                    )}
                </div>
            )}

            {layout === "showcase" && (
                <>
                    <div className="hub-showcase">
                        {mainTiles.map(tile => (
                            <Link key={tile.to} to={tile.to} className={`hub-show hub-${tile.accent ?? accent}`}>
                                <div className="hub-show-art">
                                    <TileImage tile={tile} />
                                </div>
                                <h2>{tile.title}</h2>
                                <p>{tile.description}</p>
                                <Cta tile={tile} />
                            </Link>
                        ))}
                    </div>
                    {wideTiles.map(tile => (
                        <OverlayTile key={tile.to} tile={tile} accent={accent} className="hub-overlay-wide" />
                    ))}
                </>
            )}

            {layout === "steps" && (
                <div className="hub-steps">
                    {mainTiles.map((tile, i) => (
                        <Link key={tile.to} to={tile.to} className={`hub-step hub-${tile.accent ?? accent} ${i % 2 ? "hub-step-alt" : ""}`}>
                            <div className="hub-step-art">
                                <TileImage tile={tile} />
                            </div>
                            <div className="hub-step-text">
                                <h2>{tile.title}</h2>
                                <p>{tile.description}</p>
                                <span className="hub-step-button">{tile.cta ?? "Open"} <span aria-hidden="true">&rarr;</span></span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
