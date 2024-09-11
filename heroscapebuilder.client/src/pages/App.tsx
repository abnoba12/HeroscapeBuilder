import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/scss/paper-dashboard.scss";
import Footer from "../components/Footer/Footer";
import Home from "./Home/Home";
import Printing from "./army-cards/printing/printing";

const App: React.FC = () => {
    return (
        <Router>
            <div className="wrapper">
                <Sidebar />
                <div className="main-panel ps ps--active-y">
                    <div className="content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/army-cards" element={<Home />} />
                            <Route path="/army-cards/standard" element={<Home />} />
                            <Route path="/army-cards/threebyfive" element={<Home />} />
                            <Route path="/army-cards/fourbysix" element={<Home />} />
                            <Route path="/army-cards/printing" element={<Printing />} />
                            <Route path="/units" element={<Home />} />
                            <Route path="/units/unit-data" element={<Home />} />
                            <Route path="/game-play" element={<Home />} />
                            <Route path="/game-play/game-play-calc" element={<Home />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </div>
        </Router>
    );
};

export default App;
