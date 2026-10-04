import { Alert, Box, Button, Card, CardActionArea, CardContent, Chip, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePagePointSystem } from '../../components/PointSystem/PointSystemContext';
import { useUrlEnum } from '../../services/url-state';
import PointSystemPicker from '../../components/PointSystem/PointSystemPicker';
import { Unit } from '../../models/unit';
import { Set as UnitSet } from '../../models/set';
import { speciesKey, speciesLabel } from '../../models/species';
import { getMyUnits } from '../../services/my_army-service';
import { getUnits } from '../../services/unit-service';
import { creatorLabel } from './battlegroups/battlegroup-parts';

type UnitWithQuantity = Unit & { quantity?: number };

interface Tally {
    owned: number;
    total: number;
}

interface SetTally extends Tally {
    set: UnitSet;
    units: Unit[];
}

interface CreatorTally extends Tally {
    creator: string;
    sets: SetTally[];
}

type SetFilter = 'all' | 'complete' | 'in-progress' | 'not-started';
const SET_FILTERS: readonly SetFilter[] = ['all', 'complete', 'in-progress', 'not-started'];

const percent = ({ owned, total }: Tally) => (total > 0 ? (owned / total) * 100 : 0);

/** Rounds down so a set is never shown as 100% until it is actually complete. */
const formatPercent = (tally: Tally) => `${Math.floor(percent(tally))}%`;

const matchesFilter = (tally: Tally, filter: SetFilter) => {
    switch (filter) {
        case 'complete': return tally.total > 0 && tally.owned === tally.total;
        case 'in-progress': return tally.owned > 0 && tally.owned < tally.total;
        case 'not-started': return tally.owned === 0;
        default: return true;
    }
};

const compareSets = (a: SetTally, b: SetTally) => {
    // Most complete first; ties go oldest release first, and sets without a date go last.
    const aDate = a.set.releaseDate ?? '9999';
    const bDate = b.set.releaseDate ?? '9999';
    return percent(b) - percent(a) || aDate.localeCompare(bDate) || a.set.name.localeCompare(b.set.name);
};

const CompletionBar: React.FC<{ tally: Tally; height?: number }> = ({ tally, height = 8 }) => {
    const complete = tally.total > 0 && tally.owned === tally.total;
    return (
        <LinearProgress
            variant="determinate"
            value={percent(tally)}
            color={complete ? 'success' : 'primary'}
            sx={{ height, borderRadius: height / 2 }}
        />
    );
};

interface LabeledTally extends Tally {
    key: string;
    label: string;
}

interface GeneralTally extends LabeledTally {
    units: Unit[];
}

const TallyCards = <T extends LabeledTally>({ tallies, onSelect }: { tallies: T[]; onSelect?: (tally: T) => void }) => (
    <div className="row gy-3 mb-4">
        {tallies.map(tally => {
            const content = (
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{tally.label}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatPercent(tally)}</Typography>
                    </Stack>
                    <CompletionBar tally={tally} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {`${tally.owned} of ${tally.total} units`}
                    </Typography>
                </CardContent>
            );
            return (
                <div key={tally.key} className="col-sm-6 col-md-4 col-xl-3">
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        {onSelect
                            ? <CardActionArea sx={{ height: '100%' }} onClick={() => onSelect(tally)}>{content}</CardActionArea>
                            : content}
                    </Card>
                </div>
            );
        })}
    </div>
);

/** One creator's share of a general, with the units still missing tucked behind a toggle. */
const GeneralCreatorRow: React.FC<{ creator: string; units: Unit[]; ownedIds: Set<number> }> = ({ creator, units, ownedIds }) => {
    const [showMissing, setShowMissing] = useState(false);
    const missing = units.filter(unit => !ownedIds.has(unit.id)).sort((a, b) => a.name.localeCompare(b.name));
    const tally = { owned: units.length - missing.length, total: units.length };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{creatorLabel(creator)}</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {`${formatPercent(tally)} · ${tally.owned} / ${tally.total}`}
                </Typography>
            </Stack>
            <CompletionBar tally={tally} />
            {missing.length > 0 && (
                <>
                    <Button size="small" sx={{ mt: 0.5, px: 0, textTransform: 'none' }} onClick={() => setShowMissing(value => !value)}>
                        {showMissing ? 'Hide missing' : `Show ${missing.length} missing`}
                    </Button>
                    <Collapse in={showMissing} unmountOnExit>
                        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                            {missing.map(unit => (
                                <li key={unit.id}>
                                    <Typography variant="body2" component="span">{unit.name}</Typography>
                                    {unit.set?.name && (
                                        <Typography variant="caption" color="text.secondary">{` · ${unit.set.name}`}</Typography>
                                    )}
                                </li>
                            ))}
                        </Box>
                    </Collapse>
                </>
            )}
        </Box>
    );
};

const GeneralDialog: React.FC<{ general: GeneralTally | null; ownedIds: Set<number>; onClose: () => void }> = ({ general, ownedIds, onClose }) => {
    const byCreator = useMemo(() => {
        const groups = new Map<string, Unit[]>();
        for (const unit of general?.units ?? []) {
            const creator = unit.creator || 'Unknown';
            groups.set(creator, [...(groups.get(creator) ?? []), unit]);
        }
        return [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
    }, [general]);

    return (
        <Dialog open={general !== null} onClose={onClose} maxWidth="sm" fullWidth>
            {general && (
                <>
                    <DialogTitle>
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
                            <span>{general.label}</span>
                            <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
                                {`${formatPercent(general)} · ${general.owned} / ${general.total}`}
                            </Typography>
                        </Stack>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Stack spacing={2.5}>
                            {byCreator.map(([creator, units]) => (
                                <GeneralCreatorRow key={creator} creator={creator} units={units} ownedIds={ownedIds} />
                            ))}
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Close</Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

/** A set's completion row; selecting it expands a list of the units still needed to finish the set. */
const SetRow: React.FC<{ tally: SetTally; ownedIds: Set<number> }> = ({ tally, ownedIds }) => {
    const [open, setOpen] = useState(false);
    const missing = tally.units.filter(unit => !ownedIds.has(unit.id)).sort((a, b) => a.name.localeCompare(b.name));
    const toggle = () => setOpen(value => !value);

    return (
        <>
            <TableRow
                hover
                onClick={toggle}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } }}
                tabIndex={0}
                aria-expanded={open}
                sx={{ cursor: 'pointer', '& > td': open ? { borderBottom: 'none' } : undefined }}
            >
                <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        <Box component="span" sx={{ display: 'inline-block', width: 16, color: 'text.secondary' }}>{open ? '▾' : '▸'}</Box>
                        {tally.set.name}
                    </Typography>
                    {tally.set.wave && tally.set.wave !== tally.set.type && (
                        <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                            {/^\d/.test(tally.set.wave) ? `Wave ${tally.set.wave}` : tally.set.wave}
                        </Typography>
                    )}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{tally.set.type}</TableCell>
                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ flexGrow: 1 }}><CompletionBar tally={tally} /></Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 40, textAlign: 'right' }}>
                            {formatPercent(tally)}
                        </Typography>
                    </Stack>
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{`${tally.owned} / ${tally.total}`}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={4} sx={{ py: 0, ...(open ? {} : { borderBottom: 'none' }) }}>
                    <Collapse in={open} unmountOnExit>
                        <Box sx={{ pb: 1.5, pl: 2 }}>
                            {missing.length === 0 ? (
                                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>Complete - you own every unit in this set.</Typography>
                            ) : (
                                <>
                                    <Typography variant="body2" color="text.secondary">{`Missing ${missing.length}:`}</Typography>
                                    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                                        {missing.map(unit => (
                                            <li key={unit.id}>
                                                <Typography variant="body2" component="span">{unit.name}</Typography>
                                                {unit.general && (
                                                    <Typography variant="caption" color="text.secondary">{` · ${unit.general}`}</Typography>
                                                )}
                                            </li>
                                        ))}
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

interface StatCategory {
    label: string;
    value: (unit: Unit) => number | null | undefined;
}

// Advanced game stats only - the Basic stats are for a mode that is kept for completeness but not played.
const STAT_CATEGORIES: StatCategory[] = [
    { label: 'Life', value: unit => unit.life },
    { label: 'Move', value: unit => unit.advMove },
    { label: 'Range', value: unit => unit.advRange },
    { label: 'Attack', value: unit => unit.advAttack },
    { label: 'Defense', value: unit => unit.advDefense },
    { label: 'Height', value: unit => unit.size },
];

interface Standout {
    label: string;
    value: number;
    units: string[];
}

/** The owned unit(s) with the highest value in a category; ties are all listed. */
const findStandout = (units: Unit[], label: string, value: (unit: Unit) => number | null | undefined): Standout | null => {
    let best: Standout | null = null;
    for (const unit of units) {
        const v = value(unit);
        if (v == null) continue;
        if (!best || v > best.value) best = { label, value: v, units: [unit.name] };
        else if (v === best.value) best.units.push(unit.name);
    }
    return best;
};

const formatNames = (names: string[], max = 3) =>
    names.length <= max ? names.join(', ') : `${names.slice(0, max).join(', ')} +${names.length - max} more`;

const ArmyStats: React.FC = () => {
    const [allUnits, setAllUnits] = useState<Unit[]>([]);
    const [myUnits, setMyUnits] = useState<UnitWithQuantity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [setFilter, setSetFilter] = useUrlEnum<SetFilter>('show', SET_FILTERS, 'all');
    const [selectedGeneral, setSelectedGeneral] = useState<GeneralTally | null>(null);
    const { pointSystem, setPointSystem, pointsFor, defaultPointSystem } = usePagePointSystem();

    useEffect(() => {
        const load = async () => {
            try {
                const [units, mine] = await Promise.all([getUnits(), getMyUnits()]);
                setAllUnits(units);
                setMyUnits((mine?.data ?? []) as UnitWithQuantity[]);
            } catch (err) {
                console.error('Error loading army stats:', err);
                setError('Failed to load your collection stats.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const ownedIds = useMemo(() => new Set(myUnits.map(unit => unit.id)), [myUnits]);

    const { overall, creators, generals, totalCopies } = useMemo(() => {
        const byCreator = new Map<string, { tally: CreatorTally; sets: Map<number, SetTally> }>();
        const byGeneral = new Map<string, GeneralTally>();

        for (const unit of allUnits) {
            const general = unit.general || 'None';
            let generalTally = byGeneral.get(general);
            if (!generalTally) {
                generalTally = { key: general, label: general, owned: 0, total: 0, units: [] };
                byGeneral.set(general, generalTally);
            }
            generalTally.total++;
            generalTally.units.push(unit);
            generalTally.owned += ownedIds.has(unit.id) ? 1 : 0;

            const creator = unit.creator || 'Unknown';
            let entry = byCreator.get(creator);
            if (!entry) {
                entry = { tally: { creator, owned: 0, total: 0, sets: [] }, sets: new Map() };
                byCreator.set(creator, entry);
            }

            const owned = ownedIds.has(unit.id) ? 1 : 0;
            entry.tally.total++;
            entry.tally.owned += owned;

            if (unit.set) {
                let setTally = entry.sets.get(unit.set.id);
                if (!setTally) {
                    setTally = { set: unit.set, owned: 0, total: 0, units: [] };
                    entry.sets.set(unit.set.id, setTally);
                }
                setTally.total++;
                setTally.owned += owned;
                setTally.units.push(unit);
            }
        }

        const creatorTallies = [...byCreator.values()]
            .map(({ tally, sets }) => ({ ...tally, sets: [...sets.values()].sort(compareSets) }))
            .sort((a, b) => b.total - a.total);

        return {
            overall: { owned: allUnits.filter(unit => ownedIds.has(unit.id)).length, total: allUnits.length },
            creators: creatorTallies,
            generals: [...byGeneral.values()].sort((a, b) => b.total - a.total || a.label.localeCompare(b.label)),
            totalCopies: myUnits.reduce((sum, unit) => sum + (unit.quantity ?? 1), 0),
        };
    }, [allUnits, myUnits, ownedIds]);

    const points = useMemo(() => ({
        withDuplicates: myUnits.reduce((sum, unit) => sum + (pointsFor(unit) ?? 0) * (unit.quantity ?? 1), 0),
        oneOfEach: myUnits.reduce((sum, unit) => sum + (pointsFor(unit) ?? 0), 0),
    }), [myUnits, pointsFor]);

    const standouts = useMemo(() => [
        ...STAT_CATEGORIES.map(category => findStandout(myUnits, category.label, category.value)),
        findStandout(myUnits, 'Points', pointsFor),
    ].filter((standout): standout is Standout => standout !== null), [myUnits, pointsFor]);

    const topSpecies = useMemo(() => {
        // Distinct units per species - owning three copies of a unit still counts it once.
        const unitIds = new Map<string, Set<number>>();
        for (const unit of myUnits) {
            const key = speciesKey(unit.race);
            if (!key) continue;
            if (!unitIds.has(key)) unitIds.set(key, new Set());
            unitIds.get(key)!.add(unit.id);
        }
        // A species you own only one of isn't much of a "top" species, so it is left off.
        return [...unitIds.entries()]
            .map(([key, ids]) => [key, ids.size] as const)
            .filter(([, count]) => count > 1)
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .slice(0, 10)
            .map(([key, count]) => [speciesLabel(key), count] as const);
    }, [myUnits]);

    if (loading) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;
    if (error) return <Alert severity="error">{error}</Alert>;

    const allSets = creators.flatMap(creator => creator.sets);
    const completeSets = allSets.filter(tally => matchesFilter(tally, 'complete')).length;

    return (
        <div className="container-fluid">
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h4">My Collection Stats</Typography>
                <PointSystemPicker value={pointSystem} onChange={setPointSystem} defaultValue={defaultPointSystem} />
            </Stack>

            {overall.owned === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Your collection is empty. <Link to="/my-heroscape/my-army">Add units to My Collection</Link> to track it.
                </Alert>
            )}

            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
                    <Box sx={{ minWidth: 140 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1 }}>{formatPercent(overall)}</Typography>
                        <Typography variant="body2" color="text.secondary">of all units owned</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                            {`${overall.owned} of ${overall.total} units`}
                        </Typography>
                        <CompletionBar tally={overall} height={12} />
                        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
                            <Chip size="small" variant="outlined" label={`${totalCopies} army cards incl. duplicates`} />
                            <Chip size="small" variant="outlined" label={`${completeSets} of ${allSets.length} sets complete`} />
                        </Stack>
                    </Box>
                </Stack>
            </Paper>

            {points.withDuplicates > 0 && (
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1 }}>{points.withDuplicates.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">{`${pointSystem} points in your collection, counting duplicates`}</Typography>
                    <Chip size="small" variant="outlined" sx={{ mt: 1.5 }} label={`${points.oneOfEach.toLocaleString()} points counting one of each unit`} />
                </Paper>
            )}

            {standouts.length > 0 && (
                <>
                    <Typography variant="h5" sx={{ mb: 1.5 }}>Standouts</Typography>
                    <div className="row gy-3 mb-4">
                        {standouts.map(standout => (
                            <div key={standout.label} className="col-6 col-md-4 col-xl-2">
                                <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">{`Highest ${standout.label.toLowerCase()}`}</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>{standout.value}</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }} title={standout.units.join(', ')}>
                                            {formatNames(standout.units)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {topSpecies.length > 0 && (
                <>
                    <Typography variant="h5" sx={{ mb: 1.5 }}>Top species</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                        <Stack spacing={1}>
                            {topSpecies.map(([species, count]) => (
                                <Stack key={species} direction="row" alignItems="center" spacing={1.5}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, width: 140, flexShrink: 0 }}>{species}</Typography>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <LinearProgress variant="determinate" value={(count / topSpecies[0][1]) * 100} sx={{ height: 8, borderRadius: 4 }} />
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 28, textAlign: 'right' }}>{count}</Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Paper>
                </>
            )}

            <Typography variant="h5" sx={{ mb: 1.5 }}>By creator</Typography>
            <TallyCards tallies={creators.map(creator => ({ ...creator, key: creator.creator, label: creatorLabel(creator.creator) }))} />

            <Typography variant="h5" sx={{ mb: 0.5 }}>By general</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Select a general to see it by creator and what you're missing.</Typography>
            <TallyCards tallies={generals} onSelect={setSelectedGeneral} />
            <GeneralDialog general={selectedGeneral} ownedIds={ownedIds} onClose={() => setSelectedGeneral(null)} />

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1} sx={{ mb: 1.5 }}>
                <Box>
                    <Typography variant="h5">By set</Typography>
                    <Typography variant="body2" color="text.secondary">Select a set to see the units you still need.</Typography>
                </Box>
                <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={setFilter}
                    onChange={(_, value: SetFilter | null) => value && setSetFilter(value)}
                >
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="complete">Complete</ToggleButton>
                    <ToggleButton value="in-progress">In progress</ToggleButton>
                    <ToggleButton value="not-started">Not started</ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            {creators.map(creator => {
                const sets = creator.sets.filter(tally => matchesFilter(tally, setFilter));
                if (!sets.length) return null;
                return (
                    <Box key={creator.creator} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{creatorLabel(creator.creator)}</Typography>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Set</TableCell>
                                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Type</TableCell>
                                        <TableCell sx={{ width: '40%' }}>Completion</TableCell>
                                        <TableCell align="right">Owned</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sets.map(tally => <SetRow key={tally.set.id} tally={tally} ownedIds={ownedIds} />)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                );
            })}
        </div>
    );
};

export default ArmyStats;
