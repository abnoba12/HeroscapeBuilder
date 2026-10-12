import { Alert, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArmyBuilder } from '../../../models/armybuilder';
import { getErrorMessages, getSharedArmyBuilder, isNotFound } from '../../../services/armybuilder-service';
import { ArmyBuilderView, VariationSwitcher, variationName } from './armybuilder-parts';

/** Public, read-only page for a shared Army builder. Only the signed-in owner sees edit controls. */
const ArmyBuilderShared: React.FC = () => {
    const { shareId } = useParams();
    const [searchParams] = useSearchParams();
    const variationParam = Number(searchParams.get('variation')) || undefined;
    const [armyBuilder, setArmyBuilder] = useState<ArmyBuilder | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setArmyBuilder(await getSharedArmyBuilder(shareId ?? '', variationParam));
            } catch (err) {
                setError(isNotFound(err)
                    ? 'This army is not available. The link may be wrong, or the owner may have stopped sharing it.'
                    : getErrorMessages(err, 'Failed to load the army.')[0]);
            }
        };
        load();
    }, [shareId, variationParam]);

    if (error) {
        return (
            <div className="container-fluid">
                <Alert severity="warning">{error}</Alert>
            </div>
        );
    }
    if (!armyBuilder) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;

    return (
        <div className="container-fluid">
            <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
                    <div>
                        <Typography variant="overline" color="text.secondary">Shared Army</Typography>
                        <Typography variant="h4">
                            {armyBuilder.variations.length > 1 ? `${armyBuilder.name} - ${variationName(armyBuilder)}` : armyBuilder.name}
                        </Typography>
                    </div>
                    {armyBuilder.isOwner && (
                        <Stack direction="row" spacing={1}>
                            <Button component={Link} to={`/my-heroscape/armybuilder/${armyBuilder.id}`}>Manage</Button>
                            <Button variant="contained" component={Link} to={`/my-heroscape/armybuilder/${armyBuilder.id}/edit`}>Edit</Button>
                        </Stack>
                    )}
                </Stack>
                {armyBuilder.variations.length > 1 && (
                    <VariationSwitcher
                        variations={armyBuilder.variations}
                        currentId={armyBuilder.id}
                        linkFor={variationId => `/armybuilder/${shareId}?variation=${variationId}`}
                    />
                )}
                <ArmyBuilderView armyBuilder={armyBuilder} />
            </Stack>
        </div>
    );
};

export default ArmyBuilderShared;
