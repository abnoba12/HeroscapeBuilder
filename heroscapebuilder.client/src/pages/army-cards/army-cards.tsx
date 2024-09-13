import React from 'react';
import stdImg from '../../assets/img/cardThumbnails/Charos-SQ.png';
import tbfImg from '../../assets/img/cardThumbnails/Index_3x5_Charos-SQ.png';
import fbsImg from '../../assets/img/cardThumbnails/Index_4x6_Charos-SQ.png';
import printImg from '../../assets/img/Printing Cards.png';

const ArmyCards: React.FC = () => {
    return (
        <div>
            <div className="cards row gy-4">
                <div className="col-md-4 card-option">
                    <a href="/army-cards/standard" className="text-decoration-none text-dark">
                        <img src={stdImg} alt="Standard Heroscape Card" className="img-fluid" />
                            <p className="text-center mt-2">Standard Heroscape Cards</p>
                    </a>
                </div>
                <div className="col-md-4 card-option">
                    <a href="/army-cards/threebyfive" className="text-decoration-none text-dark">
                        <img src={tbfImg} alt="3x5 Heroscape Index Card" className="img-fluid" />
                            <p className="text-center mt-2">3x5 Heroscape Index Cards</p>
                    </a>
                </div>
                <div className="col-md-4 card-option">
                    <a href="/army-cards/fourbysix" className="text-decoration-none text-dark">
                        <img src={fbsImg} alt="4x6 Heroscape Index Card" className="img-fluid" />
                            <p className="text-center mt-2">4x6 Heroscape Index Cards</p>
                    </a>
                </div>
            </div>
            <div className="row my-4">
            <div className="offset-md-4 col-md-4 card-option text-center">
                    <a href="/army-cards/printing" className="text-decoration-none text-dark">
                        <img src={printImg} alt="Printing" className="img-fluid" />
                    <p className="mt-2">Printing</p>
                </a>
            </div>
            </div>
        </div>
    );
};

export default ArmyCards;
