import React from 'react';
import "./Home.scss";
import { HubPage } from "../../components/HubCards/HubCards";
import type { HubTile } from "../../components/HubCards/HubCards";
import PowerDuelWidget from "../../components/PowerDuel/PowerDuelWidget";
import { isAuthenticated } from "../../services/authService";
import { useHasAccountFlag } from "../../services/local-db/use-has-account-flag";

const Home: React.FC = () => {
    // Logged-in users and visitors without an account use My Heroscape; a logged-out browser that belongs to an account must log in first.
    const hasAccountFlag = useHasAccountFlag();
    const showMyHeroscape = isAuthenticated() || hasAccountFlag === false;

    const tiles: HubTile[] = [
        {
            to: "/army-cards",
            title: "Army Cards",
            description: "Create, download, and print army cards in Standard, 3x5 and playing card formats.",
            image: "/assets/img/cardThumbnails/Charos-SQ.webp",
            imageAlt: "Heroscape Army Cards",
            accent: "green"
        },
        {
            to: "/data",
            title: "Unit Data",
            description: "Browse the stats and abilities of every Heroscape unit.",
            image: "/assets/img/DataBuilderLogo.webp",
            imageAlt: "Heroscape Data",
            accent: "blue"
        },
        {
            to: "/maps",
            title: "Game Play",
            description: "Browse custom maps and work out recommended points and game length for your group.",
            image: "/assets/img/game-play.webp",
            imageAlt: "Heroscape Game Play",
            accent: "purple"
        }
    ];
    if (showMyHeroscape) {
        tiles.push({
            to: "/my-heroscape",
            title: "My Heroscape",
            description: "Track your collection and build armies from the units you own.",
            image: "/assets/img/my-heroscape.webp",
            imageAlt: "My Heroscape",
            accent: "orange"
        });
    }

    return (
        <HubPage
            title="Heroscape Builder"
            intro="A home for the creative and custom side of Heroscape: custom units, terrain, cards, play styles, and even alternate games built from Heroscape components."
            tiles={tiles}
            layout="feature"
            after={<PowerDuelWidget />}
        >
            <div className="home-community">
                <span>Join the community:</span>
                <a href="https://github.com/abnoba12/HeroscapeBuilder/discussions" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-sm">Discussions</a>
                <a href="https://github.com/abnoba12/HeroscapeBuilder/issues" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-sm">Report Bugs and Issues</a>
            </div>
        </HubPage>
    );
};

export default Home;
