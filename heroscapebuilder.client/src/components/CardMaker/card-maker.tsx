import React, { useEffect, useState } from 'react';
import { getUnits } from '../../services/unit-service';
import { Unit } from '../../models/unit';
import 'bootstrap/dist/css/bootstrap.min.css';
import './card-maker.scss'

interface CardMakerProps {
    cardSize: string;
}

const CardMaker: React.FC<CardMakerProps> = ({ cardSize }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [unitData, setUnitData] = useState<Unit[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

    // State for form fields
    const [creator, setCreator] = useState<string>('');
    const [general, setGeneral] = useState<string>('');
    const [unitName, setUnitName] = useState<string>('');
    const [unitRace, setUnitRace] = useState<string>('');
    const [unitRole, setUnitRole] = useState<string>('');
    const [unitPersonality, setUnitPersonality] = useState<string>('');
    const [unitPlanet, setUnitPlanet] = useState<string>('');
    const [unitType, setUnitType] = useState<string>('');
    const [unitRarity, setUnitRarity] = useState<string>('');
    const [unitSizeCategory, setUnitSizeCategory] = useState<string>('');
    const [unitSize, setUnitSize] = useState<number | ''>('');
    const [life, setLife] = useState<number | ''>('');
    const [advancedMove, setAdvancedMove] = useState<number | ''>('');
    const [advancedRange, setAdvancedRange] = useState<number | ''>('');
    const [advancedAttack, setAdvancedAttack] = useState<number | ''>('');
    const [advancedDefense, setAdvancedDefense] = useState<number | ''>('');
    const [points, setPoints] = useState<number | ''>('');
    const [basicMove, setBasicMove] = useState<number | ''>('');
    const [basicRange, setBasicRange] = useState<number | ''>('');
    const [basicAttack, setBasicAttack] = useState<number | ''>('');
    const [basicDefense, setBasicDefense] = useState<number | ''>('');
    const [setName, setSetName] = useState<string>('');
    const [unitNumbers, setUnitNumbers] = useState<string>('');
    const [numberOfUnitsInSet, setNumberOfUnitsInSet] = useState<number | ''>('');

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setUnitData(await getUnits());
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchFiles();
    }, [cardSize]);

    useEffect(() => {
        async function initializeTooltips() {
            const bootstrap = await import('bootstrap'); // Dynamically import Bootstrap JS
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.forEach((tooltipTriggerEl: Element) => {
                new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }

        if (!loading) {
            initializeTooltips();
        }

        return () => {
            // Optional cleanup if needed
        };
    }, [loading, unitData]);

    useEffect(() => {
        if (selectedUnit) {
            populateUnitData(selectedUnit);
        }
    }, [selectedUnit]);

    if (loading) return <p>Loading...</p>;

    async function populateUnitData(id: string) {
        const data = unitData.find(x => x.id.toString() == id);
        if (data) {
            setCreator(data.creator);
            setGeneral(data.general ?? '');
            setUnitName(data.name);
            setUnitRace(data.race ?? '');
            setUnitRole(data.role ?? '');
            setUnitPersonality(data.personality ?? '');
            setUnitPlanet(data.planet ?? '');
            setUnitType(data.type ?? '');
            setUnitRarity(data.rarity ?? '');
            setUnitSizeCategory(data.sizeCategory ?? '');
            setUnitSize(data.size ?? '');
            setLife(data.life?? '');
            setAdvancedMove(data.advMove?? '');
            setAdvancedRange(data.advRange?? '');
            setAdvancedAttack(data.advAttack?? '');
            setAdvancedDefense(data.advDefense?? '');
            setPoints(data.points?? '');
            setBasicMove(data.basicMove?? '');
            setBasicRange(data.basicRange?? '');
            setBasicAttack(data.basicAttack?? '');
            setBasicDefense(data.basicDefense?? '');
            setSetName(data.set?.name ?? '');
            setUnitNumbers(data.unitNumbers?? '');
            setNumberOfUnitsInSet(data.set?.unitsInSet ?? '');
        }
    }

    return (
        <div id="cardMaker" className="container">
            <form id="heroscapeForm" className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="creator" className="form-label">
                        Load Unit Data
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Load up the data for an existing unit."
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <select id="unit" className="form-select" onChange={(e) => setSelectedUnit(e.target.value)}>
                        <option value="">&nbsp;</option>
                        {unitData.sort((a, b) => a.name.localeCompare(b.name)).map(x => {
                            let t = x.name;
                            t = x.creator !== 'Heroscape' ? `(${x.creator}) ${t}` : t;
                            t = unitData.map(n => n.name).filter(n => n === x.name).length > 1 ? `${t}-${x.set?.name}` : t;
                            return (
                                <option key={x.id} value={x.id}>{t}</option>
                            )
                        })}
                    </select>

                </div>

                <div className="col-md-6">
                    <label htmlFor="creator" className="form-label">
                        Card Creator
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="What organization originally produced this unit?"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <select id="creator" value={creator} className="form-select">
                        <option value="">Custom</option>
                        <option value="Heroscape">Heroscape - Hasbro / Wizards of the Coast</option>
                        <option value="Renegade">Heroscape - Renegade</option>
                        <option value="C3V">C3V - Classic Custom Creators of Valhalla</option>
                        <option value="SoV">SoV - Soldiers of Valhalla</option>
                        <option value="NGC">NGC - New Generation Customs</option>
                        <option value="C3G">C3G - Comic Custom Creators Guild</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitGeneral" className="form-label">
                        General
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Select the general the unit belongs to. <br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/General.png' alt='Unit General Image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <select id="unitGeneral" value={general} className="form-select">
                        <option value="Aquilla">Aquilla</option>
                        <option value="Einar">Einar</option>
                        <option value="Jandar">Jandar</option>
                        <option value="Ullar">Ullar</option>
                        <option value="Utgar">Utgar</option>
                        <option value="Revna">Revna</option>
                        <option value="Valkrill">Valkrill</option>
                        <option value="Vydar">Vydar</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitName" className="form-label">
                        Unit Name
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the name of the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/Unit.png' alt='Unit name image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="unitName" value={unitName} className="form-control" maxLength={35} />
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitRace" className="form-label">
                        Unit Race
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the race of the unit. Such as Human, Marro, Dragon, Kyrie.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/race.png' alt='race image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="unitRace" value={unitRace} className="form-control" maxLength={12} />
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitRole" className="form-label">
                        Unit Role
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the role of the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/role.png' alt='role image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="unitRole" value={unitRole} className="form-control" maxLength={12} />
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitPersonality" className="form-label">
                        Unit Personality
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the personality of the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/personality.png' alt='personality image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="unitPersonality" value={unitPersonality} className="form-control" maxLength={12} />
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitPlanet" className="form-label">
                        Unit Planet
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the planet of origin for the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/planet.png' alt='planet image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="unitPlanet" value={unitPlanet} className="form-control" maxLength={12} />
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitRarity" className="form-label">
                        Unit Rarity
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Select the rarity of the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/rarity.png' alt='rarity image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <select id="unitRarity" value={unitRarity} className="form-select">
                        <option value="Unique">Unique</option>
                        <option value="Uncommon">Uncommon</option>
                        <option value="Common">Common</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitType" className="form-label">
                        Unit Type
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Select whether the unit is a Hero or a Squad.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/heroOSquad.png' alt='Hero or squad image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <select id="unitType" value={unitType} className="form-select">
                        <option value="Hero">Hero</option>
                        <option value="Squad">Squad</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitSizeCategory" className="form-label">
                        Unit Size Category
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Select the size category of the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/sizecat.png' alt='size category image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <select id="unitSizeCategory" value={unitSizeCategory} className="form-select">
                        <option value="Huge">Huge</option>
                        <option value="Large">Large</option>
                        <option value="Medium">Medium</option>
                        <option value="Small">Small</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitSize" className="form-label">
                        Unit Size
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the size of the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/size.png' alt='size image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="unitSize" value={unitSize} className="form-control" />
                </div>

                <div className="col-md-6">
                    <div className="row">
                        <div className="col-md-12">
                            <input type="checkbox" id="condense" defaultChecked={true} />
                            <label className="form-label">
                                Condense Abilities
                                <span
                                    data-bs-toggle="tooltip"
                                    data-bs-html="true"
                                    title="For common abilities like 'Flying,' only the ability's name will be displayed, without its full description. However, unique abilities specific to the unit will still include their full descriptions.<br/>Common Abilities: Flying, Disengage, Counter Strike, Stealth Flying, Slither, Double Attack, Lava Resistant."
                                >
                                    <span className="q">[?]</span>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label className="form-label">
                                Abilities
                                <span
                                    data-bs-toggle="tooltip"
                                    data-bs-html="true"
                                    title="Enter the abilities of the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/ability.png' alt='ability image' />"
                                >
                                    <span className="q">[?]</span>
                                </span>
                            </label>
                            <button type="button" className="btn btn-outline-primary btn-sm" id="addAbilityBtn">Add Ability +</button>
                            <div id="abilitiesContainer" className="mt-3 container"></div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <label htmlFor="life" className="form-label">
                        Life
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the life value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/life.png' alt='life image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="life" value={life} className="form-control" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="advancedMove" className="form-label">
                        Advanced Move
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the advanced move value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/a_move.png' alt='Adv move image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="advancedMove" value={advancedMove} className="form-control" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="advancedRange" className="form-label">
                        Advanced Range
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the advanced range value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/a_range.png' alt='Adv range image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="advancedRange" value={advancedRange} className="form-control" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="advancedAttack" className="form-label">
                        Advanced Attack
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the advanced attack value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/a_attack.png' alt='Adv attack image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="advancedAttack" value={advancedAttack} className="form-control" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="advancedDefense" className="form-label">
                        Advanced Defense
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the advanced defense value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/a_defence.png' alt='Adv defense image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="advancedDefense" value={advancedDefense} className="form-control" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="points" className="form-label">
                        Points
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the points value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/points.png' alt='points image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="points" value={points} className="form-control" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="basicMove" className="form-label">
                        Basic Move
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the basic move value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/b_move.png' alt='basic move image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="basicMove" value={basicMove} className="form-control" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="basicRange" className="form-label">
                        Basic Range
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the basic range value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/b_range.png' alt='basic range image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="basicRange" value={basicRange} className="form-control" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="basicAttack" className="form-label">
                        Basic Attack
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the basic attack value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/b_attack.png' alt='basic attack image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="basicAttack" value={basicAttack} className="form-control" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="basicDefense" className="form-label">
                        Basic Defense
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the basic defense value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/b_defense.png' alt='basic defense image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="basicDefense" value={basicDefense} className="form-control" />
                </div>

                {/*Image Uploads*/}
                <div className="col-md-6">
                    <label htmlFor="hitboxImage" className="form-label">
                        Hitbox Image
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="This image will maintain its aspect ratio and will be scaled and centered to fit. It is highly recommended you use a transparent background.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/hitbox.png' alt='hitbox image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="file" id="hitboxImage" className="form-control" accept="image/*" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitImageAdvanced" className="form-label">
                        Unit Image Advanced
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="To ensure the best quality, please upload a tall rectangular image (aspect ratio 467:1000) to avoid distortion, as the image will be scaled to fit the content area. Note that the bottom half of the image will be covered by unit statistics.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/adv_unit_image.png' alt='advanced unit image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="file" id="unitImageAdvanced" className="form-control" accept="image/*" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitImageBasic" className="form-label">
                        Unit Image Basic
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="To ensure the best quality, please upload a wide rectangular image (aspect ratio 3:2) to avoid distortion, as the image will be scaled to fit the content area. Note that the bottom half of the image will be covered by unit statistics.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/basic_unit_image.png' alt='basic unit image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="file" id="unitImageBasic" className="form-control" accept="image/*" />
                </div>

                {/*Set and Numbers*/}
                <div className="col-md-6">
                    <label htmlFor="set" className="form-label">
                        Set
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the set the unit belongs to.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/set.png' alt='set image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="set" value={setName} className="form-control" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitNumbers" className="form-label">
                        Unit number(s)
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the unit number(s).<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/unit_num.png' alt='unit number image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="unitNumbers" value={unitNumbers} className="form-control" />
                </div>

                <div className="col-md-6">
                    <label htmlFor="numberOfUnitsInSet" className="form-label">
                        Number of units in set
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the number of units in the set.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/total_units.png' alt='unit in set image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="numberOfUnitsInSet" value={numberOfUnitsInSet} className="form-control" />
                </div>

                {/*Submit Button*/}
                <div className="col-md-12">
                    <button type="submit" className="btn btn-primary">Generate Heroscape Card</button>
                </div>
            </form>
            <div id="errorMessages" className="text-danger mt-3"></div>
        </div>
    );
};

export default CardMaker;