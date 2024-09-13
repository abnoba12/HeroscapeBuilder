
export interface Set {
    id: number;
    creator: string;
    name: string;
    wave?: string;
    releaseDate?: string; // `DateOnly` doesn't exist in JavaScript, so use string or `Date`
    createdAt: Date;
    type?: string;
    unitsInSet?: number;
}
