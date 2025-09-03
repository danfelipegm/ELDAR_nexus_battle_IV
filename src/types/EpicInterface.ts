export default interface EpicInterface {
    id?: number;
    name: string;
    image: string;
    description: string;
    heroType: string;
    type: string;
    effects: {
        effectType: string;
        value: number;
        durationTurns: number;
    }
    dropRate: number;
    status: boolean;
}
