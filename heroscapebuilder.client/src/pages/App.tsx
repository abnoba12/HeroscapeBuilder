import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "../assets/scss/paper-dashboard.scss";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";
import PlayingCardArmyCards from "../pages/army-cards/playingcard/playingcard_army_card";
import MakeCardStandard from "../pages/army-cards/standard/make-card-standard";
import ThreebyfiveArmyCards from "../pages/army-cards/threebyfive/threebyfive-army-cards";
import UploadStandardCard from "../pages/army-cards/standard/upload-standard-card";
import Home from "./Home/Home";
import ArmyCards from "./army-cards/army-cards";
import DownloadPlayingCard from "./army-cards/playingcard/download-playingcard";
import MakeCardPC from "./army-cards/playingcard/make-card-pc";
import Printing from "./army-cards/printing/printing";
import DownloadStandard from "./army-cards/standard/download-standard";
import StandardArmyCards from "./army-cards/standard/standard-army-cards";
import DownloadThreeByFive from "./army-cards/threebyfive/download-threebyfive";
import MakeCard3x5 from "./army-cards/threebyfive/make-card-3x5";
import GamePlayCalc from "./game-play/game-play-calc/game-play-calc";
import UnitData from "./data/unit-data/unit-data";
import UploadMap from "./maps/upload-map";
import MapList from "./maps/map-list";
import MapPage from "./maps/map-page";
import PrivateRoute from "../components/Auth/PrivateRoute";
import AdminRoute from "../components/Auth/AdminRoute";
import Login from "../pages/user/Login";
import Logout from "../pages/user/Logout";
import Register from "../pages/user/Register";
import MyArmy from "./my-heroscape/my-army";
import MyTerrain from "./my-heroscape/my-terrain";
import ArmyStats from "./my-heroscape/army-stats";
import Profile from "./user/Profile";
import PageMeta from "../components/Seo/PageMeta";
import Battlegroups from "./my-heroscape/battlegroups/battlegroups";
import BattlegroupDetail from "./my-heroscape/battlegroups/battlegroup-detail";
import BattlegroupEditor from "./my-heroscape/battlegroups/battlegroup-editor";
import BattlegroupShared from "./my-heroscape/battlegroups/battlegroup-shared";
import UnitPage from "./catalog/unit-page";
import GroupPage from "./catalog/group-page";
import { GroupIndexPage } from "./catalog/index-pages";
import PowerRanking from "./catalog/power-ranking";
import PowerBalance from "./catalog/power-balance";
import CookieConsent from "../components/CookieConsent/CookieConsent";
import Privacy from "./legal/Privacy";
import Terms from "./legal/Terms";
import { PointSystemProvider } from "../components/PointSystem/PointSystemContext";

const App: React.FC = () => {
    return (
        <Router>
            <PointSystemProvider>
            <div className="wrapper">
                <Sidebar />
                <div className="main-panel ps ps--active-y">
                    <div className="content">
                        <Routes>
                            <Route path="/" element={
                                <PageMeta title="Home" description="Free tools for the Heroscape community: build and print custom army cards, browse unit data and stats, and calculate game play time.">
                                    <Home />
                                </PageMeta>
                            } />
                            <Route path="/army-cards" element={
                                <PageMeta title="Heroscape Army Cards" description="Create, download, and print Heroscape army cards in Standard, 3x5 index, and playing card formats.">
                                    <ArmyCards />
                                </PageMeta>
                            } />
                            <Route path="/army-cards/standard" element={
                                <PageMeta title="Standard Heroscape Army Cards" description="Download or create Standard-format Heroscape army cards, ready to print.">
                                    <StandardArmyCards />
                                </PageMeta>
                            } />
                            <Route path="/army-cards/standard/download" element={
                                <PageMeta title="Download Standard Army Cards" heading="Download Standard Army Cards" description="Download print-ready Standard-format Heroscape army cards.">
                                    <DownloadStandard />
                                </PageMeta>
                            } />
                            <Route path="/army-cards/standard/create" element={
                                <PageMeta title="Create a Standard Army Card" heading="Create a Standard Army Card" description="Design your own custom Standard-format Heroscape army card.">
                                    <MakeCardStandard />
                                </PageMeta>
                            } />
                            <Route path="/army-cards/standard/upload" element={
                                <AdminRoute>
                                    <PageMeta title="Upload Standard Card PDF" description="Admin tool for uploading Standard army card PDFs." noindex>
                                        <UploadStandardCard />
                                    </PageMeta>
                                </AdminRoute>
                            } />
                            <Route path="/army-cards/threebyfive" element={
                                <PageMeta title="3x5 Heroscape Index Cards" description="Download or create 3x5 index-card-format Heroscape army cards, ready to print.">
                                    <ThreebyfiveArmyCards />
                                </PageMeta>
                            } />
                            <Route path="/army-cards/threebyfive/download" element={
                                <PageMeta title="Download 3x5 Army Cards" heading="Download 3x5 Army Cards" description="Download print-ready 3x5 index-format Heroscape army cards.">
                                    <DownloadThreeByFive />
                                </PageMeta>
                            } />
                            <Route path="/army-cards/threebyfive/create" element={
                                <PageMeta title="Create a 3x5 Army Card" heading="Create a 3x5 Army Card" description="Design your own custom 3x5 index-format Heroscape army card.">
                                    <MakeCard3x5 />
                                </PageMeta>
                            } />
                            <Route path="/army-cards/playingcard" element={
                                <PageMeta title="Heroscape Playing Cards" description="Download or create standard playing-card-format Heroscape army cards, ready to print.">
                                    <PlayingCardArmyCards />
                                </PageMeta>
                            } />
                            <Route path="/army-cards/playingcard/download" element={
                                <PageMeta title="Download Army Playing Cards" heading="Download Army Playing Cards" description="Download print-ready playing-card-format Heroscape army cards.">
                                    <DownloadPlayingCard />
                                </PageMeta>
                            } />
                            <Route path="/army-cards/playingcard/create" element={
                                <PageMeta title="Create an Army Playing Card" heading="Create an Army Playing Card" description="Design your own custom playing-card-format Heroscape army card.">
                                    <MakeCardPC />
                                </PageMeta>
                            } />
                            <Route path="/army-cards/printing" element={
                                <PageMeta title="Printing Heroscape Cards" heading="Printing Heroscape Cards" description="Recommended print services and settings for printing your custom Heroscape army cards.">
                                    <Printing />
                                </PageMeta>
                            } />
                            <Route path="/data" element={
                                <PageMeta title="Heroscape Unit Data" heading="Heroscape Unit Data" description="Browse stats and abilities for every Heroscape unit." canonicalPath="/data/unit-data">
                                    <UnitData />
                                </PageMeta>
                            } />
                            <Route path="/data/unit-data" element={
                                <PageMeta title="Heroscape Unit Data" heading="Heroscape Unit Data" description="Browse stats and abilities for every Heroscape unit.">
                                    <UnitData/>
                                </PageMeta>
                            } />
                            <Route path="/units/:slug" element={<UnitPage />} />
                            <Route path="/power-ranking" element={<PowerRanking />} />
                            <Route path="/power-ranking/balance" element={
                                <AdminRoute>
                                    <PageMeta title="Power vs. Points" description="Admin report comparing the power ranking with unit points." noindex>
                                        <PowerBalance />
                                    </PageMeta>
                                </AdminRoute>
                            } />
                            <Route path="/maps" element={
                                <PageMeta title="Heroscape Maps" heading="Heroscape Maps" description="Browse custom Heroscape maps by creator, number of players and terrain, and download printable build guides.">
                                    <MapList />
                                </PageMeta>
                            } />
                            <Route path="/maps/upload" element={
                                <AdminRoute>
                                    <PageMeta title="Upload Map" description="Admin tool for uploading map PDFs." noindex>
                                        <UploadMap />
                                    </PageMeta>
                                </AdminRoute>
                            } />
                            <Route path="/maps/:id/edit" element={
                                <AdminRoute>
                                    <PageMeta title="Edit Map" description="Admin tool for editing a map." noindex>
                                        <UploadMap />
                                    </PageMeta>
                                </AdminRoute>
                            } />
                            <Route path="/maps/:idSlug" element={<MapPage />} />
                            <Route path="/species" element={<GroupIndexPage kind="species" />} />
                            <Route path="/species/:slug" element={<GroupPage kind="species" />} />
                            <Route path="/generals" element={<GroupIndexPage kind="generals" />} />
                            <Route path="/generals/:slug" element={<GroupPage kind="generals" />} />
                            <Route path="/sets" element={<GroupIndexPage kind="sets" />} />
                            <Route path="/sets/:slug" element={<GroupPage kind="sets" />} />
                            <Route path="/game-play" element={
                                <PageMeta title="Heroscape Game Play Calculator" heading="Heroscape Game Play Calculator" description="Calculate recommended points and game length for your Heroscape game based on player count and playtime." canonicalPath="/game-play/game-play-calc">
                                    <GamePlayCalc />
                                </PageMeta>
                            } />
                            <Route path="/game-play/game-play-calc" element={
                                <PageMeta title="Heroscape Game Play Calculator" heading="Heroscape Game Play Calculator" description="Calculate recommended points and game length for your Heroscape game based on player count and playtime.">
                                    <GamePlayCalc />
                                </PageMeta>
                            } />
                            <Route path="/user/login" element={
                                <PageMeta title="Log In" description="Log in to your Heroscape Builder account." noindex>
                                    <Login />
                                </PageMeta>
                            } />
                            <Route path="/user/register" element={
                                <PageMeta title="Register" description="Create a Heroscape Builder account." noindex>
                                    <Register />
                                </PageMeta>
                            } />
                            <Route path="/privacy" element={
                                <PageMeta title="Privacy Policy" description="How Heroscape Builder collects, uses, and protects your information.">
                                    <Privacy />
                                </PageMeta>
                            } />
                            <Route path="/terms" element={
                                <PageMeta title="Terms of Service" description="The terms for using Heroscape Builder.">
                                    <Terms />
                                </PageMeta>
                            } />
                            {/*Public, read-only view of a shared Battlegroup*/}
                            <Route path="/battlegroup/:shareId" element={
                                <PageMeta title="Shared Army" description="A Heroscape army shared from Heroscape Builder." noindex>
                                    <BattlegroupShared />
                                </PageMeta>
                            } />

                            {/*Private routes*/}
                            <Route path="/user/logout" element={
                                <PrivateRoute>
                                    <PageMeta title="Log Out" description="Log out of your Heroscape Builder account." noindex>
                                        <Logout />
                                    </PageMeta>
                                </PrivateRoute>
                            } />
                            <Route path="/user/profile" element={
                                <PrivateRoute>
                                    <PageMeta title="Profile" description="Manage your Heroscape Builder account." noindex>
                                        <Profile />
                                    </PageMeta>
                                </PrivateRoute>
                            } />
                            <Route path="/my-heroscape" element={
                                <PrivateRoute>
                                    <PageMeta title="My Heroscape" description="Manage your personal Heroscape unit collection." noindex>
                                        <MyArmy />
                                    </PageMeta>
                                </PrivateRoute>
                            } />
                            <Route path="/my-heroscape/my-army" element={
                                <PrivateRoute>
                                    <PageMeta title="My Collection" description="Manage your personal Heroscape unit collection." noindex>
                                        <MyArmy />
                                    </PageMeta>
                                </PrivateRoute>
                            } />
                            <Route path="/my-heroscape/my-terrain" element={
                                <PrivateRoute>
                                    <PageMeta title="My Terrain" description="Record the Heroscape terrain you own." noindex>
                                        <MyTerrain />
                                    </PageMeta>
                                </PrivateRoute>
                            } />
                            <Route path="/my-heroscape/army-stats" element={
                                <PrivateRoute>
                                    <PageMeta title="My Collection Stats" description="See how much of each Heroscape creator and set your collection covers." noindex>
                                        <ArmyStats />
                                    </PageMeta>
                                </PrivateRoute>
                            } />
                            <Route path="/my-heroscape/battlegroups" element={
                                <PrivateRoute>
                                    <PageMeta title="My Armies" description="Build armies from your Heroscape collection within a point limit." noindex>
                                        <Battlegroups />
                                    </PageMeta>
                                </PrivateRoute>
                            } />
                            <Route path="/my-heroscape/battlegroups/new" element={
                                <PrivateRoute>
                                    <PageMeta title="New Army" description="Create a Heroscape army." noindex>
                                        <BattlegroupEditor />
                                    </PageMeta>
                                </PrivateRoute>
                            } />
                            <Route path="/my-heroscape/battlegroups/:id" element={
                                <PrivateRoute>
                                    <PageMeta title="Army" description="View a Heroscape army." noindex>
                                        <BattlegroupDetail />
                                    </PageMeta>
                                </PrivateRoute>
                            } />
                            <Route path="/my-heroscape/battlegroups/:id/edit" element={
                                <PrivateRoute>
                                    <PageMeta title="Edit Army" description="Edit a Heroscape army." noindex>
                                        <BattlegroupEditor />
                                    </PageMeta>
                                </PrivateRoute>
                            } />
                        </Routes>
                    </div>
                    <Footer />
                </div>
                <CookieConsent />
            </div>
            </PointSystemProvider>
        </Router>
    );
};

export default App;
