export type CardDetail = {
    artFilename: string,
    CardName: string,
    CardStack: number,
    RewardName: string,
    rewardClass: string,
    isCorrupted: Boolean,
    Flavour: string
  };
  
  export type Card = {
    name: string,
    stack: number,
    chaosprice: number,
    exaltedprice: number,
    Details: CardDetail
  };
  
  export type Reward = {
    name: string,
    chaosprice: number,
    exaltedprice: number
  };
  
  export type TableData = {
    Card: Card,
    Reward: Reward,
    setchaosprice: number,
    setexprice: number,
    chaosprofit: number,
    exprofit: number,
    isCurrency: Boolean
  };

  export type LeagueDetails = {
    ExaltValue: number,
    DivineValue: number,
    AnullValue: number,
    XMirrorValue: number,
    LastUpdated: string,
    Table: Array<TableData>
  };
  
  export type LeagueResult = {
    success: Boolean,
    details: LeagueDetails
  };

  export type Leagues = {
    leagueName?: string,
    startAt?: string,
    endAt?: string,
    ladder?: string
    DaysLeft?: number
  };

  export type CurrencyValues = {
    Exalted?: number,
    Divine?: number,
    Annul?: number,
    Mirror?: number
  };

  export type Currency = "chaos" | "exalted";
  export type KeyStates = "c1" | "c2" | "c3" | "c4" | "c5" | "c6" | "c7" | "c8" | "c9" | "c10" | undefined;