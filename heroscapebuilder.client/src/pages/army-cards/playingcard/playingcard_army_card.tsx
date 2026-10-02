import React from 'react';
import { HubPage } from '../../../components/HubCards/HubCards';

const PlayingCardArmyCards: React.FC = () => {
    return (
        <HubPage
            title="Playing Cards"
            intro="Army cards sized like playing cards, easy to shuffle and hold."
            accent="green"
            layout="steps"
            crumbs={[{ label: "Home", to: "/" }, { label: "Army Cards", to: "/army-cards" }, { label: "Playing Cards" }]}
            tiles={[
                {
                    to: "/army-cards/playingcard/download",
                    title: "Download Army Cards",
                    description: "Grab print-ready cards for existing Heroscape units.",
                    image: "/assets/img/card_pile_4x6.webp",
                    cta: "Browse downloads"
                },
                {
                    to: "/army-cards/playingcard/create",
                    title: "Create a New Army Card",
                    description: "Design your own custom unit and export it as a card.",
                    image: "/assets/img/CardMaker.webp",
                    cta: "Open card maker"
                }
            ]}
        />
    );
};

export default PlayingCardArmyCards;
