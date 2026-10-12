import { keyframes } from '@emotion/react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    LinearProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import type { Instance } from '@popperjs/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { Unit } from '../../../models/unit';
import { ArmyBuilder, ArmyBuilderVariation } from '../../../models/armybuilder';
import { getCreatorInfo } from '../../../models/creator';
import { PointSystem, getUnitPoints } from '../../../models/point-system';

/** An army's creator restriction is one creator or several joined by commas. */
export const parseCreators = (creator?: string | null): string[] =>
    (creator ?? '').split(',').map(part => part.trim().toUpperCase()).filter(Boolean);

const singleCreatorLabel = (creator: string): string => getCreatorInfo(creator)?.label ?? creator.toUpperCase();

export const creatorLabel = (creator?: string | null): string => {
    const creators = parseCreators(creator);
    return creators.length > 0 ? creators.map(singleCreatorLabel).join(' + ') : 'Any creator';
};

/** A variation's own name, or - when it has none - what sets it apart (its limit, and its creator restriction). */
export const variationName = (variation: Pick<ArmyBuilderVariation, 'label' | 'pointLimit' | 'creator'>): string => {
    if (variation.label) return variation.label;
    const creators = parseCreators(variation.creator);
    return creators.length > 0
        ? `${variation.pointLimit} pts, ${creators.map(singleCreatorLabel).join(' + ')}`
        : `${variation.pointLimit} pts`;
};

/** Links to each variation of an army, the current one highlighted. */
export const VariationSwitcher: React.FC<{
    variations: ArmyBuilderVariation[];
    currentId: number;
    linkFor: (variationId: number) => string;
    showReview?: boolean;
}> = ({ variations, currentId, linkFor, showReview = false }) => (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary', mr: 0.5 }}>Variations</Typography>
        {variations.map(variation => {
            const current = variation.id === currentId;
            return (
                <Chip
                    key={variation.id}
                    component={Link}
                    to={linkFor(variation.id)}
                    clickable
                    replace
                    color="primary"
                    variant={current ? 'filled' : 'outlined'}
                    label={`${showReview && variation.needsReview ? '⚠ ' : ''}${variationName(variation)}`}
                    sx={{
                        height: 40,
                        px: 1,
                        borderRadius: 2,
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        borderWidth: 2,
                        bgcolor: current ? undefined : 'background.paper',
                        boxShadow: current ? 3 : 1,
                        '&:hover': { boxShadow: 4 },
                    }}
                />
            );
        })}
    </Stack>
);

export const isUniqueUnit = (rarity?: string | null): boolean => rarity?.toLowerCase() === 'unique';

const UnitInfoCard: React.FC<{ unit: Unit; pointSystem: PointSystem; showPoints: boolean }> = ({ unit, pointSystem, showPoints }) => {
    const stats: [string, string | number | null | undefined][] = [
        ...(showPoints ? [['Points', getUnitPoints(unit, pointSystem)] as [string, number | undefined]] : []),
        ['Life', unit.life],
        ['Move', unit.advMove],
        ['Range', unit.advRange],
        ['Attack', unit.advAttack],
        ['Defense', unit.advDefense],
    ];
    const abilities = unit.abilities ?? [];
    return (
        <Box sx={{ p: 0.5, maxWidth: 360 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{unit.name}</Typography>
            {unit.sizeCategory && (
                <Typography variant="caption" sx={{ opacity: 0.8 }}>{unit.sizeCategory}</Typography>
            )}
            <Stack direction="row" spacing={2} sx={{ my: 1 }}>
                {stats.map(([label, value]) => (
                    <Box key={label} sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>{label}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>{value ?? '-'}</Typography>
                    </Box>
                ))}
            </Stack>
            {abilities.length === 0 && <Typography variant="caption">No abilities.</Typography>}
            {abilities.map(ability => (
                <Box key={ability.id} sx={{ mt: 0.75 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{ability.abilityName}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', whiteSpace: 'pre-line' }}>{ability.ability}</Typography>
                </Box>
            ))}
        </Box>
    );
};

interface UnitHoverProps {
    unit: Unit;
    pointSystem: PointSystem;
    children: React.ReactNode;
    /** Leave the points out of the popup (the power ranking duels never show points). Defaults to showing them. */
    showPoints?: boolean;
    /** Wrap a whole block (such as a card) instead of underlining a name. */
    block?: boolean;
    /** Where a block's popup opens relative to the pointer. Defaults to beside it. */
    blockPlacement?: 'right-start' | 'bottom-start';
}

/**
 * Wraps a unit name (or card); hovering shows its name, advanced stats (with life) and abilities.
 * A name gets a popup beside it. A wide block (a card or a list row) follows the pointer instead, because a
 * popup anchored to the edge of a wide row would land far from where the pointer is.
 */
export const UnitHover: React.FC<UnitHoverProps> = ({ unit, pointSystem, children, showPoints = true, block = false, blockPlacement = 'right-start' }) => {
    const pointer = React.useRef({ x: 0, y: 0 });
    const popper = React.useRef<Instance | null>(null);

    const onMouseMove = (event: React.MouseEvent) => {
        pointer.current = { x: event.clientX, y: event.clientY };
        popper.current?.update();
    };

    return (
        <Tooltip
            title={<UnitInfoCard unit={unit} pointSystem={pointSystem} showPoints={showPoints} />}
            placement={block ? blockPlacement : 'right'}
            enterDelay={150}
            enterNextDelay={150}
            slotProps={{
                tooltip: { sx: { maxWidth: 'none', bgcolor: 'grey.900' } },
                popper: block
                    ? {
                        popperRef: popper,
                        // A zero-size anchor at the pointer; the popup keeps clear of the pointer and flips at screen edges.
                        anchorEl: { getBoundingClientRect: () => new DOMRect(pointer.current.x, pointer.current.y, 0, 0) },
                        modifiers: [{ name: 'offset', options: { offset: [0, 18] } }],
                    }
                    : undefined,
            }}
        >
            <Box
                component="span"
                onMouseMove={block ? onMouseMove : undefined}
                sx={block
                    ? { display: 'flex', flex: '1 1 0', minWidth: 0 }
                    : { cursor: 'help', textDecoration: 'underline dotted', textUnderlineOffset: 3 }}
            >
                {children}
            </Box>
        </Tooltip>
    );
};

const pulse = keyframes`
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 23, 68, 0.7); }
    50% { box-shadow: 0 0 0 8px rgba(255, 23, 68, 0); }
`;

/** Loud, animated marker for an army builder that no longer fits the owner's My Army. */
export const NeedsReviewChip: React.FC = () => (
    <Chip
        label="⚠ NEEDS REVIEW"
        size="small"
        sx={{
            bgcolor: '#ff1744',
            color: '#fff',
            fontWeight: 800,
            letterSpacing: 0.5,
            animation: `${pulse} 1.6s infinite`,
        }}
    />
);

export const NeedsReviewBanner: React.FC<{ reasons: string[]; children?: React.ReactNode }> = ({ reasons, children }) => (
    <Box
        role="alert"
        sx={{
            bgcolor: '#ff1744',
            color: '#fff',
            borderRadius: 1,
            p: 2,
            animation: `${pulse} 1.6s infinite`,
        }}
    >
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            ⚠ This army needs review
        </Typography>
        {reasons.map(reason => (
            <Typography key={reason} variant="body2">{reason}</Typography>
        ))}
        {children}
    </Box>
);

export const PointsMeter: React.FC<{ total: number; limit: number }> = ({ total, limit }) => {
    const over = total > limit;
    const remaining = limit - total;
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography variant="body2" sx={{ fontWeight: 600, color: over ? 'error.main' : 'text.primary' }}>
                    {`${total} / ${limit} points`}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: over ? 'error.main' : 'success.main' }}>
                    {over ? `${-remaining} over` : `${remaining} remaining`}
                </Typography>
            </Stack>
            <LinearProgress
                variant="determinate"
                value={limit > 0 ? Math.min(100, (total / limit) * 100) : 0}
                color={over ? 'error' : 'primary'}
                sx={{ height: 8, borderRadius: 4 }}
            />
        </Box>
    );
};

export const ConfirmDeleteDialog: React.FC<{
    open: boolean;
    name: string;
    busy?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    /** How many variations go with it; more than one adds a warning. */
    variationCount?: number;
    /** Deleting one variation instead of the whole army. */
    variationOnly?: boolean;
}> = ({ open, name, busy, onCancel, onConfirm, variationCount = 1, variationOnly = false }) => (
    <Dialog open={open} onClose={onCancel}>
        <DialogTitle>{variationOnly ? 'Delete variation?' : 'Delete army?'}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {variationOnly
                    ? `"${name}" will be permanently deleted, along with its results and journal. The rest of the army is not affected.`
                    : `"${name}" will be permanently deleted${variationCount > 1 ? `, along with all ${variationCount} of its variations` : ''}. If it is shared, its public link will stop working. Your units in My Collection are not affected.`}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel} disabled={busy}>Cancel</Button>
            <Button onClick={onConfirm} color="error" variant="contained" disabled={busy}>Delete</Button>
        </DialogActions>
    </Dialog>
);

/** Read-only army builder: summary, restrictions and unit list. Used by the owner's detail page and the public page. */
export const ArmyBuilderView: React.FC<{ armyBuilder: ArmyBuilder }> = ({ armyBuilder }) => {
    const showOwnerFlags = armyBuilder.isOwner;
    const unitCount = armyBuilder.units.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Stack spacing={2}>
            {showOwnerFlags && armyBuilder.needsReview && (
                <NeedsReviewBanner reasons={armyBuilder.reviewReasons}>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                        Edit the army (or update My Collection) to clear this warning.
                    </Typography>
                </NeedsReviewBanner>
            )}

            <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                    <Typography variant="subtitle2" color="text.secondary">Criteria</Typography>
                    <PointsMeter total={armyBuilder.totalPoints} limit={armyBuilder.pointLimit} />
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip label={`Point limit: ${armyBuilder.pointLimit}`} size="small" variant="outlined" />
                        <Chip label={`${armyBuilder.pointSystem} points`} size="small" variant="outlined" />
                        <Chip label={`Creator: ${creatorLabel(armyBuilder.creator)}`} size="small" variant="outlined" />
                        <Chip label={`Units: ${unitCount}`} size="small" variant="outlined" />
                        <Chip label="Unique units: max 1 each" size="small" variant="outlined" />
                    </Stack>
                </Stack>
            </Paper>

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Unit</TableCell>
                            <TableCell align="right">Qty</TableCell>
                            <TableCell align="right">Points</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell>General</TableCell>
                            <TableCell>Rarity</TableCell>
                            <TableCell>Creator</TableCell>
                            <TableCell>Set</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {armyBuilder.units.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="body2" color="text.secondary">No units yet.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {armyBuilder.units.map(item => {
                            const points = getUnitPoints(item.unit, armyBuilder.pointSystem) ?? 0;
                            const flagged = showOwnerFlags && item.overAllocated;
                            return (
                                <TableRow key={item.unit.id} sx={flagged ? { bgcolor: 'rgba(255, 23, 68, 0.12)' } : undefined}>
                                    <TableCell>
                                        <UnitHover unit={item.unit} pointSystem={armyBuilder.pointSystem}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, display: 'inline-block' }}>{item.unit.name}</Typography>
                                        </UnitHover>
                                        {flagged && (
                                            <Typography variant="caption" sx={{ color: '#d50000', fontWeight: 700 }}>
                                                {`⚠ My Collection has ${item.ownedQuantity}, this army uses ${item.quantity}`}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right">{points}</TableCell>
                                    <TableCell align="right">{points * item.quantity}</TableCell>
                                    <TableCell>{item.unit.general}</TableCell>
                                    <TableCell>{item.unit.rarity}</TableCell>
                                    <TableCell>{item.unit.creator}</TableCell>
                                    <TableCell>{item.unit.set?.name}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {armyBuilder.notes && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>How to play</Typography>
                    {/* Rendered as plain text (React escapes it); line breaks are kept. */}
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                        {armyBuilder.notes}
                    </Typography>
                </Paper>
            )}
        </Stack>
    );
};
