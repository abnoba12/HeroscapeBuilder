import React from 'react';
import "./Home.scss";
import { isAuthenticated } from "../../services/authService";

const Home: React.FC = () => {
    const showMyHeroscape = isAuthenticated();
    const areaClass = showMyHeroscape ? "col-md-3 site-area" : "col-md-4 site-area";

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 text-center">
                    <h1>Heroscape Builder</h1>
                    <p>Welcome to our site, dedicated to the creative and custom aspects of Heroscape. Here, we aim to support
                        and inspire your creativity by providing resources for custom units, terrain, cards,
                        play styles, and even alternate games using Heroscape components. Our goal is to foster a community
                        where imagination and innovation thrive within this fantastic game platform. Explore and
                        enjoy the offerings we have available, including Heroscape cards in various formats tailored to your
                        preferences.</p>
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
                    <a href="https://github.com/abnoba12/HeroscapeBuilder/discussions" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success btn-sm mb-2">Visit our Discussions Page</a>
                </div>
                <div className="col-6 text-center">
                    <a href="https://github.com/abnoba12/HeroscapeBuilder/issues" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success btn-sm mb-2">Report Bugs and Issues</a>
                </div>
                <div className="col-12 text-center">
                    <hr />
                </div>
            </div>
            <section className="cards row gy-4">
                <div className={areaClass}>
                    <a href="/army-cards" className="text-decoration-none text-dark">
                        <img src="/assets/img/cardThumbnails/Charos-SQ.png" alt="Heroscape Army Cards" className="img-fluid" />
                            <p className="text-center mt-2">Heroscape Army Cards</p>
                    </a>
                </div>
                <div className={areaClass}>
                    <a href="/data" className="text-decoration-none text-dark">
                        <img src="/assets/img/DataBuilderLogo.png" alt="Heroscape Data" className="img-fluid" />
                            <p className="text-center mt-2">Heroscape Data</p>
                    </a>
                </div>
                <div className={areaClass}>
                    <a href="/game-play" className="text-decoration-none text-dark">
                        <img src="/assets/img/game-play.png" alt="Heroscape Game Play Calculator" className="img-fluid" />
                        <p className="text-center mt-2">Game Play</p>
                    </a>
                </div>
                {showMyHeroscape && (
                    <div className={areaClass}>
                        <a href="/my-heroscape" className="text-decoration-none text-dark">
                            <img src="/assets/img/my-heroscape.png" alt="My Heroscape" className="img-fluid" />
                            <p className="text-center mt-2">My Heroscape</p>
                        </a>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
