export declare namespace TypiaProgrammer {
    interface ILocation {
        input: string;
        output: string;
        project: string;
    }
    const build: (location: TypiaProgrammer.ILocation) => Promise<void>;
}
