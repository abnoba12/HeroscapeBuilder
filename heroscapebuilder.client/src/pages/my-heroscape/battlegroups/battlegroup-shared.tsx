import { Alert, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Battlegroup } from '../../../models/battlegroup';
import { getErrorMessages, getSharedBattlegroup, isNotFound } from '../../../services/battlegroup-service';
import { BattlegroupView } from './battlegroup-parts';

/** Public, read-only page for a shared Battlegroup. Only the signed-in owner sees edit controls. */
const BattlegroupShared: React.FC = () => {
    const { shareId } = useParams();
    const [battlegroup, setBattlegroup] = useState<Battlegroup | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setBattlegroup(await getSharedBattlegroup(shareId ?? ''));
            } catch (err) {
                setError(isNotFound(err)
                    ? 'This Battlegroup is not available. The link may be wrong, or the owner may have stopped sharing it.'
                    : getErrorMessages(err, 'Failed to load the Battlegroup.')[0]);
            }
        };
        load();
    }, [shareId]);

    if (error) {
        return (
            <div className="container-fluid">
                <Alert severity="warning">{error}</Alert>
            </div>
        );
    }
    if (!battlegroup) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;

    return (
        <div className="container-fluid">
            <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
                    <div>
                        <Typography variant="overline" color="text.secondary">Shared Battlegroup</Typography>
                        <Typography variant="h4">{battlegroup.name}</Typography>
                    </div>
                    {battlegroup.isOwner && (
                        <Stack direction="row" spacing={1}>
                            <Button component={Link} to={`/my-heroscape/battlegroups/${battlegroup.id}`}>Manage</Button>
                            <Button variant="contained" component={Link} to={`/my-heroscape/battlegroups/${battlegroup.id}/edit`}>Edit</Button>
                        </Stack>
                    )}
                </Stack>
                <BattlegroupView battlegroup={battlegroup} />
            </Stack>
        </div>
    );
};

export default BattlegroupShared;
