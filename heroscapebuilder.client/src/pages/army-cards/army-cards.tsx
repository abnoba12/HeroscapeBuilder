import React from 'react';
import { HubPage } from '../../components/HubCards/HubCards';

const ArmyCards: React.FC = () => {
    return (
        <HubPage
            title="Heroscape Army Cards"
            intro="Download or create army cards in the format that suits your table, then print them."
            accent="green"
            tiles={[
                {
                    to: "/army-cards/standard",
                    title: "Standard Cards",
                    description: "The classic full-size Heroscape army card.",
                    image: "/assets/img/cardThumbnails/Charos-SQ.webp",
                    imageAlt: "Standard Heroscape card"
                },
                {
                    to: "/army-cards/threebyfive",
                    title: "3x5 Index Cards",
                    description: "Cards sized for 3x5 index cards, easy to print at home.",
                    image: "/assets/img/cardThumbnails/Index_3x5_Charos-SQ.webp",
                    imageAlt: "3x5 Heroscape index card"
                },
                {
                    to: "/army-cards/playingcard",
                    title: "Playing Cards",
                    description: "Compact cards the size of a deck of playing cards.",
                    image: "/assets/img/cardThumbnails/Index_PC_Charos-SQ.webp",
                    imageAlt: "Heroscape playing card"
                },
                {
                    to: "/army-cards/printing",
                    title: "Printing Cards",
                    description: "Recommended print services and settings.",
                    image: "/assets/img/Printing Cards.webp",
                    imageAlt: "Printing cards",
                    cta: "Printing tips",
                    accent: "orange",
                    wide: true
                }
            ]}
            layout="showcase"
            crumbs={[{ label: "Home", to: "/" }, { label: "Army Cards" }]}
        />
    );
};

export default ArmyCards;
