import React from 'react';
import { HubPage } from '../../../components/HubCards/HubCards';

const StandardArmyCards: React.FC = () => {
    return (
        <HubPage
            title="Standard Army Cards"
            intro="Full-size Heroscape army cards in the classic format."
            accent="green"
            layout="steps"
            crumbs={[{ label: "Home", to: "/" }, { label: "Army Cards", to: "/army-cards" }, { label: "Standard" }]}
            tiles={[
                {
                    to: "/army-cards/standard/download",
                    title: "Download Army Cards",
                    description: "Grab print-ready cards for existing Heroscape units.",
                    image: "/assets/img/card_pile.webp",
                    cta: "Browse downloads"
                },
                {
                    to: "/army-cards/standard/create",
                    title: "Create a New Army Card",
                    description: "Design your own custom unit and export it as a card.",
                    image: "/assets/img/CardMaker.webp",
                    cta: "Open card maker"
                }
            ]}
        />
    );
};

export default StandardArmyCards;
