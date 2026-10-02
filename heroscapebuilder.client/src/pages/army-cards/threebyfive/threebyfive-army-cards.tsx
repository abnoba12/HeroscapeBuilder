import React from 'react';
import { HubPage } from '../../../components/HubCards/HubCards';

const ThreebyfiveArmyCards: React.FC = () => {
    return (
        <HubPage
            title="3x5 Index Cards"
            intro="Army cards sized to print on standard 3x5 index cards."
            accent="green"
            layout="steps"
            crumbs={[{ label: "Home", to: "/" }, { label: "Army Cards", to: "/army-cards" }, { label: "3x5 Index Cards" }]}
            tiles={[
                {
                    to: "/army-cards/threebyfive/download",
                    title: "Download Army Cards",
                    description: "Grab print-ready cards for existing Heroscape units.",
                    image: "/assets/img/card_pile_3x5.webp",
                    cta: "Browse downloads"
                },
                {
                    to: "/army-cards/threebyfive/create",
                    title: "Create a New Army Card",
                    description: "Design your own custom unit and export it as a card.",
                    image: "/assets/img/CardMaker.webp",
                    cta: "Open card maker"
                }
            ]}
        />
    );
};

export default ThreebyfiveArmyCards;
