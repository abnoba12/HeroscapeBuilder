import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "../assets/scss/paper-dashboard.scss";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";
import FourbysixArmyCards from "../pages/army-cards/fourbysix/fourbysix_army_card";
import MakeCardStandard from "../pages/army-cards/standard/make-card-standard";
import ThreebyfiveArmyCards from "../pages/army-cards/threebyfive/threebyfive-army-cards";
import Home from "./Home/Home";
import ArmyCards from "./army-cards/army-cards";
import DownloadfourBySix from "./army-cards/fourbysix/download-fourbysix";
import Printing from "./army-cards/printing/printing";
import DownloadStandard from "./army-cards/standard/download-standard";
import StandardArmyCards from "./army-cards/standard/standard-army-cards";
import DownloadThreeByFive from "./army-cards/threebyfive/download-threebyfive";
import GamePlayCalc from "./game-play/game-play-calc/game-play-calc";

const App: React.FC = () => {
    return (
        <Router>
            <div className="wrapper">
                <Sidebar />
                <div className="main-panel ps ps--active-y">
                    <div className="content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/army-cards" element={<ArmyCards />} />
                            <Route path="/army-cards/standard" element={<StandardArmyCards />} />
                            <Route path="/army-cards/standard/download" element={<DownloadStandard />} />
                            <Route path="/army-cards/standard/create" element={<MakeCardStandard />} />
                            <Route path="/army-cards/threebyfive" element={<ThreebyfiveArmyCards />} />
                            <Route path="/army-cards/threebyfive/download" element={<DownloadThreeByFive />} />
                            <Route path="/army-cards/fourbysix" element={<FourbysixArmyCards />} />
                            <Route path="/army-cards/fourbysix/download" element={<DownloadfourBySix />} />
                            <Route path="/army-cards/printing" element={<Printing />} />
                            <Route path="/units" element={<Home />} />
                            <Route path="/units/unit-data" element={<Home />} />
                            <Route path="/game-play" element={<GamePlayCalc />} />
                            <Route path="/game-play/game-play-calc" element={<GamePlayCalc />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </div>
        </Router>
    );
};

export default App;
