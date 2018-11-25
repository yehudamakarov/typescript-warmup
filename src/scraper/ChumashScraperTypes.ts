export interface IPasukObject {
    pasukNumber: string;
    pasukWords: string;
}
export type Pesukim = IPasukObject[];

export interface IChumashSection {
    learnOnDate: Date;
    dayOfTheWeek: string;
    hebrewPesukim: Pesukim;
    englishPesukim: Pesukim;
    amountOfPesukim: number | null;
    rashiDocument: IRashiSection;
    aliyah: number;
    mmddyyyy: string;
    parshaNameEnglish: string;
}

export interface IRashiObject {
    belongsToPasuk: string;
    diburHamaschil: string;
    rashiWords: string;
}
export type RashiToAPasuk = IRashiObject[];

export interface IRashisOnAPasuk {
    thatBelongToPasuk: string;
    rashisForThisPasuk: RashiToAPasuk;
}
export type TodaysRashiContent = IRashisOnAPasuk[];

export interface IRashiSection {
    learnOnDate: Date;
    todaysHebrewRashiContent: TodaysRashiContent;
    todaysEnglishRashiContent: TodaysRashiContent;
    amountOfRashis: number | null;
    aliyah: number;
    mmddyyyy: string;
}
