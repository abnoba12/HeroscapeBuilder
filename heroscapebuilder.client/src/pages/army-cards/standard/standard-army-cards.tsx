import React from 'react';
import cardsImg from '../../../assets/img/card_pile.png';
import cardMaker from '../../../assets/img/CardMaker.png'

const StandardArmyCards: React.FC = () => {
    return (
        <div>
            <div className="cards row gy-6">
                <div className="col-md-4 card-option text-center">
                    <a href="/army-cards/standard/download" className="text-decoration-none text-dark">
                        <h1 className="text-center mt-2">Download Standard Army Cards</h1>
                        <img src={cardsImg} alt="Standard Heroscape Card" className="img-fluid" />
                    </a>
                </div>
                <div className="col-md-6 card-option text-center">
                    <a href="/army-cards/standard/create" className="text-decoration-none text-dark">
                        <h1 className="text-center mt-2">Create a New Army Card</h1>
                        <img src={cardMaker} alt="Create standard Heroscape Card" className="img-fluid" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default StandardArmyCards;
