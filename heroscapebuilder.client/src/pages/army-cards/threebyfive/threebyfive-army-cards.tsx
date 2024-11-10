import React from 'react';

const ThreebyfiveArmyCards: React.FC = () => {
    return (
        <div>
            <div className="cards row gy-6">
                <div className="offset-md-1 col-md-2 card-option text-center">
                    <a href="/army-cards/threebyfive/download" className="text-decoration-none text-dark">
                        <img src="/assets/img/card_pile_3x5.png" alt="Standard Heroscape Card" className="img-fluid" />
                    </a>
                </div>
                <div className="col-md-6 card-option d-flex align-items-center">
                    <a href="/army-cards/threebyfive/download" className="text-decoration-none text-dark">
                        <h1 className="text-center mt-2">Download 3x5 Army Cards</h1>
                    </a>
                </div>
            </div>
            <div className="cards row gy-6">
                <div className="offset-md-1 col-md-2 card-option text-center">
                    <a href="/army-cards/threebyfive/create" className="text-decoration-none text-dark">
                        <img src="/assets/img/CardMaker.png" alt="Create standard Heroscape Card" className="img-fluid" />
                    </a>
                </div>
                <div className="col-md-6 card-option d-flex align-items-center">
                    <a href="/army-cards/threebyfive/create" className="text-decoration-none text-dark">
                        <h1 className="text-center mt-2">Create a New Army Card</h1>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ThreebyfiveArmyCards;
