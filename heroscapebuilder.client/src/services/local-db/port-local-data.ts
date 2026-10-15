import AxiosSingletonService from '../AxiosSingletonService';
import { DATA_STORES, dbClear, dbGetAll, isIndexedDbAvailable } from './idb';
import { markHasAccount } from './local-account';
import {
    ArmyBuilderJournalRow,
    ArmyBuilderRow,
    ArmyBuilderUnitRow,
    ArmyGameRow,
    ArmyGameUnitRow,
    UserCardRow,
    UserTerrainRow,
} from './rows';

const api = AxiosSingletonService.getInstance();

const toGame = (game: ArmyGameRow, units: ArmyGameUnitRow[]) => ({
    won: game.Won,
    playedAt: game.PlayedAt,
    note: game.Note,
    createdAt: game.CreatedAt,
    units: units
        .filter(u => u.ArmyGameId === game.id)
        .map(u => ({ armyCardId: u.ArmyCardId, quantity: u.Quantity, points: u.Points })),
});

/** True when the browser holds anything worth moving to an account. */
const hasLocalData = async (): Promise<boolean> => {
    for (const store of DATA_STORES) {
        if ((await dbGetAll(store)).length > 0) return true;
    }
    return false;
};

/**
 * Moves everything the visitor saved in this browser into the account they just logged in to, then erases the
 * browser copy and records that this browser's owner has an account. The browser copy is only erased once the
 * server confirms the import, so a failure loses nothing and is retried at the next login.
 */
export const portLocalDataToAccount = async (): Promise<void> => {
    if (isIndexedDbAvailable()) {
        try {
            if (await hasLocalData()) {
                const [cards, terrain, armies, units, journal, games, gameUnits] = await Promise.all([
                    dbGetAll<UserCardRow>('user_cards'),
                    dbGetAll<UserTerrainRow>('user_terrain'),
                    dbGetAll<ArmyBuilderRow>('armybuilder'),
                    dbGetAll<ArmyBuilderUnitRow>('armybuilder_unit'),
                    dbGetAll<ArmyBuilderJournalRow>('armybuilder_journal'),
                    dbGetAll<ArmyGameRow>('army_game'),
                    dbGetAll<ArmyGameUnitRow>('army_game_unit'),
                ]);

                const bundle = {
                    userCards: cards.map(c => ({ ownedArmyCard: c.OwnedArmyCard, quantity: c.Quantity })),
                    userTerrain: terrain.map(t => ({
                        terrainTypeId: t.terrain_type_id,
                        terrainSizeId: t.terrain_size_id,
                        quantity: t.quantity,
                    })),
                    armies: armies.map(a => ({
                        localId: a.id,
                        parentLocalId: a.ParentArmyBuilderId,
                        name: a.Name,
                        variationLabel: a.VariationLabel,
                        pointLimit: a.PointLimit,
                        pointSystem: a.PointSystem,
                        creator: a.Creator,
                        notes: a.Notes,
                        isRetired: a.IsRetired,
                        retiredAt: a.RetiredAt,
                        createdAt: a.CreatedAt,
                        updatedAt: a.UpdatedAt,
                        units: units
                            .filter(u => u.ArmyBuilderId === a.id)
                            .map(u => ({ armyCardId: u.ArmyCardId, quantity: u.Quantity })),
                        journal: journal
                            .filter(j => j.ArmyBuilderId === a.id)
                            .map(j => ({
                                entryDate: j.EntryDate,
                                wentWell: j.WentWell,
                                wentPoorly: j.WentPoorly,
                                notes: j.Notes,
                                createdAt: j.CreatedAt,
                                updatedAt: j.UpdatedAt,
                            })),
                        games: games.filter(g => g.ArmyBuilderId === a.id).map(g => toGame(g, gameUnits)),
                    })),
                    detachedGames: games.filter(g => g.ArmyBuilderId === null).map(g => toGame(g, gameUnits)),
                };

                await api.post('/LocalImport/ImportLocalData', bundle);
                await dbClear([...DATA_STORES]);
            }
        } catch (error) {
            // Nothing was erased, so the next login tries again.
            console.error('Could not move saved browser data to the account', error);
        }
    }

    await markHasAccount();
};
