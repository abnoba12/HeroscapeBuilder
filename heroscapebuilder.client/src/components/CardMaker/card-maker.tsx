import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import React, { useEffect, useRef, useState } from 'react';
import { Ability } from '../../models/ability';
import { Unit } from '../../models/unit';
import { UnitFormData } from '../../models/unit-form-data';
import { generateIndexCard, initializePDF, savePDF } from '../../services/card-maker-service';
import { getUnits } from '../../services/unit-service';
import './card-maker.scss';
import { base64ToBlob } from '../../services/image-service';
import { fetchImageWithCache } from '../../services/image-cache-service';

interface CardMakerProps {
    cardSize: string;
}

const CardMaker: React.FC<CardMakerProps> = ({ cardSize }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false); // For handling button spinner
    const [unitData, setUnitData] = useState<Unit[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
    const [unitSize, setUnitSize] = useState<number | undefined>(undefined);
    const [life, setLife] = useState<number | undefined>(0);
    const [abilities, setAbilities] = useState<Ability[]>([]);
    const [advancedMove, setAdvancedMove] = useState<number | undefined>(undefined);
    const [advancedRange, setAdvancedRange] = useState<number | undefined>(undefined);
    const [advancedAttack, setAdvancedAttack] = useState<number | undefined>(undefined);
    const [advancedDefense, setAdvancedDefense] = useState<number | undefined>(undefined);
    const [points, setPoints] = useState<number | undefined>(undefined);
    const [basicMove, setBasicMove] = useState<number | undefined>(undefined);
    const [basicRange, setBasicRange] = useState<number | undefined>(undefined);
    const [basicAttack, setBasicAttack] = useState<number | undefined>(undefined);
    const [basicDefense, setBasicDefense] = useState<number | undefined>(undefined);
    const [setName, setSetName] = useState<string>('');
    const [unitNumbers, setUnitNumbers] = useState<string>('');
    const [numberOfUnitsInSet, setNumberOfUnitsInSet] = useState<number | undefined>(undefined);
    const [condenseAbilitiesChecked, setCondenseAbilitiesChecked] = useState<boolean>(true); // default to true

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

    //REGION: Load existing unit data
    useEffect(() => {
        if (selectedUnit) {
            populateUnitData(selectedUnit);
        }
    }, [selectedUnit]);
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
            setUnitSize(data.size);
            setLife(data.life);
            setAbilities(data.abilities);
            setAdvancedMove(data.advMove);
            setAdvancedRange(data.advRange);
            setAdvancedAttack(data.advAttack);
            setAdvancedDefense(data.advDefense);
            setPoints(data.points);
            setBasicMove(data.basicMove);
            setBasicRange(data.basicRange);
            setBasicAttack(data.basicAttack);
            setBasicDefense(data.basicDefense);
            setSetName(data.set?.name ?? '');
            setUnitNumbers(data.unitNumbers ?? '');
            setNumberOfUnitsInSet(data.set?.unitsInSet);

            if (data.files && data.files.length) {
                var hb = data.files.filter(x => x.filePurpose == "Card_Hitbox_Image");
                var b = data.files.filter(x => x.filePurpose == "Card_Basic_Image");
                var adv;
                if (cardSize == "3x5") {
                    adv = data.files.filter(x => x.filePurpose == "Card_3x5_Advanced_Image");
                    b = [];
                } else if (cardSize == "4x6") {
                    adv = data.files.filter(x => x.filePurpose == "Card_4x6_Advanced_Image");
                } else if (cardSize == "Standard") {
                    adv = data.files.filter(x => x.filePurpose == "Card_Advanced_Image_Standard");
                }

                if (adv && adv.length) {
                    // Load and set the advanced unit image
                    handleLoadImage(adv[0].filePath, AdvancedImageRef);
                } else {
                    if (AdvancedImageRef?.current) {
                        AdvancedImageRef.current.value = '';
                    }
                }

                if (hb && hb.length) {
                    // Load and set the hitbox image
                    handleLoadImage(hb[0].filePath, hitboxImageRef);
                } else {
                    if (hitboxImageRef?.current) {
                        hitboxImageRef.current.value = '';
                    }
                }

                if (b && b.length) {
                    // Load and set the basic unit image
                    handleLoadImage(b[0].filePath, BasicImageRef);
                } else {
                    if (BasicImageRef?.current) {
                        BasicImageRef.current.value = '';
                    }
                }
            }
        }
    }

    //REGION: Abilities
    const handleAddAbility = () => {
        setAbilities([...abilities, { id: 0, armyCardId: 0, abilityName: '', ability: '' }]);
    };
    const handleRemoveAbility = (id: number) => {
        setAbilities(abilities.filter((ability) => ability.id !== id));
    };
    const handleAbilityChange = (id: number, key: keyof Ability, value: string) => {
        setAbilities(abilities.map((ability) => ability.id === id ? { ...ability, [key]: value } : ability));
    };

    //REGION: Images
    const hitboxImageRef = useRef<HTMLInputElement>(null);
    const AdvancedImageRef = useRef<HTMLInputElement>(null);
    const BasicImageRef = useRef<HTMLInputElement>(null);
    const loadImage = (imageUrl: string, inputElement: HTMLInputElement | null) => {
        if (!inputElement) return;

        fetch(imageUrl)
            .then(async response => {
                const contentDisposition = response.headers.get('Content-Disposition');
                let fileName = 'default.png'; // Default file name

                if (contentDisposition && contentDisposition.includes('filename=')) {
                    fileName = contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '');
                } else {
                    const urlParts = imageUrl.split('/');
                    fileName = urlParts[urlParts.length - 1];
                }

                const mimeType = response.headers.get('Content-Type') || 'image/png';

                return { blob: base64ToBlob(await fetchImageWithCache(imageUrl, fileName)), fileName, mimeType };
            })
            .then(({ blob, fileName, mimeType }) => {
                const file = new File([blob], fileName, { type: mimeType });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                // Assign the file to the input element
                if (inputElement && dataTransfer.files) {
                    inputElement.files = dataTransfer.files;
                }
            })
            .catch(error => {
                console.error('Error loading image:', error);
            });
    };
    const handleLoadImage = (imageUrl: string, element: React.RefObject<HTMLInputElement>) => {
        loadImage(imageUrl, element.current);
    };

    //REGION: Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!creator.trim()) newErrors.creator = 'Creator is required';
        if (!general.trim()) newErrors.general = 'General is required';
        if (!unitName.trim()) newErrors.unitName = 'Unit name is required';
        if (!unitRace.trim()) newErrors.unitRace = 'Unit race is required';
        if (!unitRole.trim()) newErrors.unitRole = 'Unit role is required';
        if (!unitPersonality.trim()) newErrors.unitPersonality = 'Unit personality is required';
        if (!unitPlanet.trim()) newErrors.unitPlanet = 'Unit planet is required';
        if (!unitRarity.trim()) newErrors.unitRarity = 'Unit rarity is required';
        if (!unitType.trim()) newErrors.unitType = 'Unit Type is required';
        if (!unitSizeCategory.trim()) newErrors.unitSizeCategory = 'Unit Size Category is required';
        if (!unitSize || unitSize <= 0) newErrors.unitSize = 'Unit Size is required and must be greater than 0';
        if (life === undefined || life <= 0) newErrors.life = 'Life is required and must be greater than 0';
        if (advancedMove === undefined || advancedMove <= 0) newErrors.advancedMove = 'Advanced Move is required and must be greater than 0';
        if (advancedRange === undefined || advancedRange <= 0) newErrors.advancedRange = 'Advanced Range is required and must be greater than 0';
        if (advancedAttack === undefined || advancedAttack <= 0) newErrors.advancedAttack = 'Advanced Attack is required and must be greater than 0';
        if (advancedDefense === undefined || advancedDefense <= 0) newErrors.advancedDefense = 'Advanced Defense is required and must be greater than 0';
        if (points === undefined || points <= 0) newErrors.points = 'Points are required and must be greater than 0';
        if (basicMove === undefined || basicMove <= 0) newErrors.basicMove = 'Basic Move is required and must be greater than 0';
        if (basicRange === undefined || basicRange <= 0) newErrors.basicRange = 'Basic Range is required and must be greater than 0';
        if (basicAttack === undefined || basicAttack <= 0) newErrors.basicAttack = 'Basic Attack is required and must be greater than 0';
        if (basicDefense === undefined || basicDefense <= 0) newErrors.basicDefense = 'Basic Defense is required and must be greater than 0';
        if (hitboxImageRef.current && hitboxImageRef.current.files?.length === 0) newErrors.hitboxImage = "Hitbox image is required";
        if (AdvancedImageRef.current && AdvancedImageRef.current.files?.length === 0) newErrors.unitImageAdvanced = "Advanced image is required";
        if (BasicImageRef.current && BasicImageRef.current.files?.length === 0 && cardSize != '3x5') newErrors.unitImageBasic = "Basic image is required";        

        setErrors(newErrors);

        // If no errors, submit the form
        if (Object.keys(newErrors).length === 0) {
            try {
                setSubmitting(true); // Show spinner while submitting
                const formData: UnitFormData = {
                    creator, // Maps directly to creator
                    general, // Optional, so mapped directly to general
                    name: unitName, // unitName maps to name
                    race: unitRace, // unitRace maps to race
                    role: unitRole, // unitRole maps to role
                    personality: unitPersonality, // unitPersonality maps to personality
                    planet: unitPlanet, // unitPlanet maps to planet
                    rarity: unitRarity, // unitRarity maps to rarity
                    type: unitType, // unitType maps to type
                    sizeCategory: unitSizeCategory, // unitSizeCategory maps to sizeCategory
                    size: unitSize, // unitSize maps to size
                    life, // Maps directly to life
                    advMove: advancedMove, // advancedMove maps to advMove
                    advRange: advancedRange, // advancedRange maps to advRange
                    advAttack: advancedAttack, // advancedAttack maps to advAttack
                    advDefense: advancedDefense, // advancedDefense maps to advDefense
                    points, // Maps directly to points
                    basicMove, // Maps directly to basicMove
                    basicRange, // Maps directly to basicRange
                    basicAttack, // Maps directly to basicAttack
                    basicDefense, // Maps directly to basicDefense
                    unitNumbers, // Maps directly to unitNumbers
                    abilities, // Maps directly to abilities (Ability[])
                    set: { // setName and numberOfUnitsInSet map to the Set model
                        id: 0, // Set ID can be fetched or assigned later
                        creator: creator, // Maps to the creator of the set
                        name: setName, // Maps to the setName
                        unitsInSet: numberOfUnitsInSet, // Maps to numberOfUnitsInSet
                        createdAt: new Date()
                    },
                    files: [],
                    uploadedFiles: [
                        {
                            fileName: hitboxImageRef.current?.files?.[0]?.name || '',
                            filePurpose: "Card_Hitbox_Image",
                            data: hitboxImageRef.current?.files?.[0],
                        },
                        {
                            fileName: AdvancedImageRef.current?.files?.[0]?.name || '',
                            filePurpose: "Card_Advanced_Image",
                            data: AdvancedImageRef.current?.files?.[0],
                        },
                        {
                            fileName: BasicImageRef.current?.files?.[0]?.name || '',
                            filePurpose: "Card_Basic_Image",
                            data: BasicImageRef.current?.files?.[0],
                        }
                    ],
                    condenseAbilities: condenseAbilitiesChecked, // Custom field for condensing abilities
                    id: 0, // ID will be fetched or assigned later
                    note: "", // Add any note if necessary
                };


                let doc: jsPDF = initializePDF(cardSize);
                doc = await generateIndexCard(doc, formData, cardSize);

                var fileName = `Index_${cardSize}_${formData.name.replace(/\s+/g, "_")}.pdf`;
                if (cardSize == "Standard") {
                    fileName = `${formData.name.replace(/\s+/g, "_")}.pdf`;

                    if (formData.creator == "Renegade") {
                        fileName = `${formData.name.replace(/\s+/g, "_")}-OG.pdf`;
                    }
                }

                await savePDF(doc, fileName);
            } catch (e) {
                throw e;
            } finally {
                setSubmitting(false); // Hide spinner once done
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div id="cardMaker" className="container-fluid">
            <form id="heroscapeForm" className="row g-3" onSubmit={handleSubmit}>
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
                        <option value="">Select Unit (Optional)</option>
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
                        Card Creator <span className="text-danger">*</span>
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
                    {errors.creator && <div className="invalid-feedback">{errors.creator}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitGeneral" className="form-label">
                        General <span className="text-danger">*</span>
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
                    {errors.general && <div className="invalid-feedback">{errors.general}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitName" className="form-label">
                        Unit Name <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the name of the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/Unit.png' alt='Unit name image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="unitName" value={unitName} className="form-control" maxLength={35} />
                    {errors.unitName && <div className="invalid-feedback">{errors.unitName}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitRace" className="form-label">
                        Unit Race <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the race of the unit. Such as Human, Marro, Dragon, Kyrie.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/race.png' alt='race image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="unitRace" value={unitRace} className="form-control" maxLength={12} />
                    {errors.unitRace && <div className="invalid-feedback">{errors.unitRace}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitRole" className="form-label">
                        Unit Role <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the role of the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/role.png' alt='role image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="unitRole" value={unitRole} className="form-control" maxLength={12} />
                    {errors.unitRole && <div className="invalid-feedback">{errors.unitRole}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitPersonality" className="form-label">
                        Unit Personality <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the personality of the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/personality.png' alt='personality image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="unitPersonality" value={unitPersonality} className="form-control" maxLength={12} />
                    {errors.unitPersonality && <div className="invalid-feedback">{errors.unitPersonality}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitPlanet" className="form-label">
                        Unit Planet <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the planet of origin for the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/planet.png' alt='planet image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="text" id="unitPlanet" value={unitPlanet} className="form-control" maxLength={12} />
                    {errors.unitPlanet && <div className="invalid-feedback">{errors.unitPlanet}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitRarity" className="form-label">
                        Unit Rarity <span className="text-danger">*</span>
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
                    {errors.unitRarity && <div className="invalid-feedback">{errors.unitRarity}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitType" className="form-label">
                        Unit Type <span className="text-danger">*</span>
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
                    {errors.unitType && <div className="invalid-feedback">{errors.unitType}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitSizeCategory" className="form-label">
                        Unit Size Category <span className="text-danger">*</span>
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
                    {errors.unitSizeCategory && <div className="invalid-feedback">{errors.unitSizeCategory}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitSize" className="form-label">
                        Unit Size <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the size of the unit.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/size.png' alt='size image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="unitSize" value={unitSize} className="form-control" />
                    {errors.unitSize && <div className="invalid-feedback">{errors.unitSize}</div>}
                </div>

                <div className="col-md-6">
                    <div className="row">
                        <div className="col-md-12">
                            <input
                                type="checkbox"
                                id="condense"
                                checked={condenseAbilitiesChecked}
                                onChange={(e) => setCondenseAbilitiesChecked(e.target.checked)} // Update state when checkbox is changed
                            />&nbsp;
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
                                    title="Enter the abilities of the unit."
                                >
                                    <span className="q">[?]</span>
                                </span>
                            </label>
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleAddAbility}>
                                Add Ability +
                            </button>
                            <div id="abilitiesContainer" className="mt-3 container">
                                {abilities.map((ability) => (
                                    <div className="row ability-row mb-3" key={ability.id}>
                                        <div className="col-md-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ability Name"
                                                value={ability.abilityName}
                                                onChange={(e) => handleAbilityChange(ability.id, 'abilityName', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-7">
                                            <textarea
                                                className="form-control"
                                                placeholder="Ability Description"
                                                rows={2}
                                                value={ability.ability}
                                                onChange={(e) => handleAbilityChange(ability.id, 'ability', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <button type="button" className="btn btn-danger" onClick={() => handleRemoveAbility(ability.id)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.abilities && <div className="invalid-feedback">{errors.abilities}</div>}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <label htmlFor="life" className="form-label">
                        Life <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the life value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/life.png' alt='life image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="life" value={life} className="form-control" />
                    {errors.life && <div className="invalid-feedback">{errors.life}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="advancedMove" className="form-label">
                        Advanced Move <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the advanced move value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/a_move.png' alt='Adv move image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="advancedMove" value={advancedMove} className="form-control" />
                    {errors.advancedMove && <div className="invalid-feedback">{errors.advancedMove}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="advancedRange" className="form-label">
                        Advanced Range <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the advanced range value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/a_range.png' alt='Adv range image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="advancedRange" value={advancedRange} className="form-control" />
                    {errors.advancedRange && <div className="invalid-feedback">{errors.advancedRange}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="advancedAttack" className="form-label">
                        Advanced Attack <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the advanced attack value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/a_attack.png' alt='Adv attack image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="advancedAttack" value={advancedAttack} className="form-control" />
                    {errors.advancedAttack && <div className="invalid-feedback">{errors.advancedAttack}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="advancedDefense" className="form-label">
                        Advanced Defense <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the advanced defense value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/a_defence.png' alt='Adv defense image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="advancedDefense" value={advancedDefense} className="form-control" />
                    {errors.advancedDefense && <div className="invalid-feedback">{errors.advancedDefense}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="points" className="form-label">
                        Points <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the points value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/points.png' alt='points image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="points" value={points} className="form-control" />
                    {errors.points && <div className="invalid-feedback">{errors.points}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="basicMove" className="form-label">
                        Basic Move <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the basic move value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/b_move.png' alt='basic move image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="basicMove" value={basicMove} className="form-control" />
                    {errors.basicMove && <div className="invalid-feedback">{errors.basicMove}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="basicRange" className="form-label">
                        Basic Range <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the basic range value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/b_range.png' alt='basic range image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="basicRange" value={basicRange} className="form-control" />
                    {errors.basicRange && <div className="invalid-feedback">{errors.basicRange}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="basicAttack" className="form-label">
                        Basic Attack <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the basic attack value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/b_attack.png' alt='basic attack image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="basicAttack" value={basicAttack} className="form-control" />
                    {errors.basicAttack && <div className="invalid-feedback">{errors.basicAttack}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="basicDefense" className="form-label">
                        Basic Defense <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="Enter the basic defense value.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/b_defense.png' alt='basic defense image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input type="number" id="basicDefense" value={basicDefense} className="form-control" />
                    {errors.basicDefense && <div className="invalid-feedback">{errors.basicDefense}</div>}
                </div>

                {/*Image Uploads*/}
                <div className="col-md-6">
                    <label htmlFor="hitboxImage" className="form-label">
                        Hitbox Image <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="This image will maintain its aspect ratio and will be scaled and centered to fit. It is highly recommended you use a transparent background.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/hitbox.png' alt='hitbox image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input ref={hitboxImageRef} type="file" id="hitboxImage" className="form-control" accept="image/*" />
                    {errors.hitboxImage && <div className="invalid-feedback">{errors.hitboxImage}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitImageAdvanced" className="form-label">
                        Unit Image Advanced <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="To ensure the best quality, please upload a tall rectangular image (aspect ratio 467:1000) to avoid distortion, as the image will be scaled to fit the content area. Note that the bottom half of the image will be covered by unit statistics.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/adv_unit_image.png' alt='advanced unit image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input ref={AdvancedImageRef} type="file" id="unitImageAdvanced" className="form-control" accept="image/*" />
                    {errors.unitImageAdvanced && <div className="invalid-feedback">{errors.unitImageAdvanced}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="unitImageBasic" className="form-label">
                        Unit Image Basic <span className="text-danger">*</span>
                        <span
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            title="To ensure the best quality, please upload a wide rectangular image (aspect ratio 3:2) to avoid distortion, as the image will be scaled to fit the content area. Note that the bottom half of the image will be covered by unit statistics.<br/><img src='https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/tooltips/basic_unit_image.png' alt='basic unit image' />"
                        >
                            <span className="q">[?]</span>
                        </span>
                    </label>
                    <input ref={BasicImageRef} type="file" id="unitImageBasic" className="form-control" accept="image/*" />
                    {errors.unitImageBasic && <div className="invalid-feedback">{errors.unitImageBasic}</div>}
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
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Generating...
                            </>
                        ) : (
                            "Generate Heroscape Card"
                        )}
                    </button>
                </div>
            </form>
            <div id="errorMessages" className="text-danger mt-3"></div>
        </div>
    );
};

export default CardMaker;