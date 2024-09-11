import React from 'react';
import "./Home.scss";
import armyCardImg from "../../assets/img/cardThumbnails/Charos-SQ.png";
import unitsImg from "../../assets/img/DataBuilderLogo.png";
import gamePlayImg from "../../assets/img/game-play.png"

const Home: React.FC = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 text-center">
                    <h5>Welcome to our site, dedicated to the creative and custom aspects of Heroscape. Here, we aim to support
                        and inspire your creativity by providing resources for custom units, terrain, cards,
                        play styles, and even alternate games using Heroscape components. Our goal is to foster a community
                        where imagination and innovation thrive within this fantastic game platform. Explore and
                        enjoy the offerings we have available, including Heroscape cards in various formats tailored to your
                        preferences.</h5>
                </div>
            </div>
            <div className="row">
                <div className="col-12 text-center">
                    <hr />
                </div>
                <div className="col-12 text-center">
                    <p>Join our community and interact with other members:</p>
                </div>
            </div>
            <div className="row">
                <div className="col-6 text-center">
                    <a href="https://github.com/abnoba12/HeroscapeIndexCardBuilder/discussions" target="_blank" className="btn btn-outline-success btn-sm mb-2">Visit our Discussions Page</a>
                </div>
                <div className="col-6 text-center">
                    <a href="https://github.com/abnoba12/HeroscapeIndexCardBuilder/issues" target="_blank" className="btn btn-outline-success btn-sm mb-2">Report Bugs and Issues</a>
                </div>
                <div className="col-12 text-center">
                    <hr />
                </div>
            </div>
            <section className="cards row gy-4">
                <div className="col-md-4 site-area">
                    <a href="/army-cards" className="text-decoration-none text-dark">
                        <img src={armyCardImg} alt="Heroscape Army Cards" className="img-fluid" />
                            <p className="text-center mt-2">Heroscape Army Cards</p>
                    </a>
                </div>
                <div className="col-md-4 site-area">
                    <a href="/units" className="text-decoration-none text-dark">
                        <img src={unitsImg} alt="Heroscape Data" className="img-fluid" />
                            <p className="text-center mt-2">Heroscape Data</p>
                    </a>
                </div>
                <div className="col-md-4 site-area">
                    <a href="/game-play" className="text-decoration-none text-dark">
                        <img src={gamePlayImg} alt="Heroscape Data" className="img-fluid" />
                        <p className="text-center mt-2">Game Play</p>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Home;
