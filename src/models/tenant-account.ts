import { UserAccount } from "./user-account";

export class TenantAccount extends UserAccount {
    public overallScore: number;
    public paymentScore: number;
    public carefulScore: number;
    public discretionScore: number;
    public relHistory: {ownerId: string, realEstateId: string}[];
    public ownerHistory: string[];
    public realEstateHistory: string[];
    public contracts: string[];

    constructor() {
        super();
        this.overallScore = null;
        this.paymentScore = null;
        this.carefulScore = null;
        this.discretionScore = null;
        this.relHistory = null;
        this.contracts = null;
    }

}