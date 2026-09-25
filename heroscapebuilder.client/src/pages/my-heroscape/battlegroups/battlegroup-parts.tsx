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
    Typography,
} from '@mui/material';
import React from 'react';
import { Battlegroup } from '../../../models/battlegroup';
import { getCreatorInfo } from '../../../models/creator';
import { getUnitPoints } from '../../../models/point-system';

export const creatorLabel = (creator?: string | null): string =>
    creator ? (getCreatorInfo(creator)?.label ?? creator.toUpperCase()) : 'Any creator';

export const isUniqueUnit = (rarity?: string | null): boolean => rarity?.toLowerCase() === 'unique';

const pulse = keyframes`
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 23, 68, 0.7); }
    50% { box-shadow: 0 0 0 8px rgba(255, 23, 68, 0); }
`;

/** Loud, animated marker for a battlegroup that no longer fits the owner's My Army. */
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
            ⚠ This Battlegroup needs review
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
}> = ({ open, name, busy, onCancel, onConfirm }) => (
    <Dialog open={open} onClose={onCancel}>
        <DialogTitle>Delete Battlegroup?</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {`"${name}" will be permanently deleted. If it is shared, its public link will stop working. Your units in My Army are not affected.`}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel} disabled={busy}>Cancel</Button>
            <Button onClick={onConfirm} color="error" variant="contained" disabled={busy}>Delete</Button>
        </DialogActions>
    </Dialog>
);

/** Read-only battlegroup: summary, restrictions and unit list. Used by the owner's detail page and the public page. */
export const BattlegroupView: React.FC<{ battlegroup: Battlegroup }> = ({ battlegroup }) => {
    const showOwnerFlags = battlegroup.isOwner;
    const unitCount = battlegroup.units.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Stack spacing={2}>
            {showOwnerFlags && battlegroup.needsReview && (
                <NeedsReviewBanner reasons={battlegroup.reviewReasons}>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                        Edit the Battlegroup (or update My Army) to clear this warning.
                    </Typography>
                </NeedsReviewBanner>
            )}

            <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                    <Typography variant="subtitle2" color="text.secondary">Criteria</Typography>
                    <PointsMeter total={battlegroup.totalPoints} limit={battlegroup.pointLimit} />
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip label={`Point limit: ${battlegroup.pointLimit}`} size="small" variant="outlined" />
                        <Chip label={`${battlegroup.pointSystem} points`} size="small" variant="outlined" />
                        <Chip label={`Creator: ${creatorLabel(battlegroup.creator)}`} size="small" variant="outlined" />
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
                        {battlegroup.units.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="body2" color="text.secondary">No units yet.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {battlegroup.units.map(item => {
                            const points = getUnitPoints(item.unit, battlegroup.pointSystem) ?? 0;
                            const flagged = showOwnerFlags && item.overAllocated;
                            return (
                                <TableRow key={item.unit.id} sx={flagged ? { bgcolor: 'rgba(255, 23, 68, 0.12)' } : undefined}>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.unit.name}</Typography>
                                        {flagged && (
                                            <Typography variant="caption" sx={{ color: '#d50000', fontWeight: 700 }}>
                                                {`⚠ My Army has ${item.ownedQuantity}, this Battlegroup uses ${item.quantity}`}
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

            {battlegroup.notes && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>How to play</Typography>
                    {/* Rendered as plain text (React escapes it); line breaks are kept. */}
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                        {battlegroup.notes}
                    </Typography>
                </Paper>
            )}
        </Stack>
    );
};
