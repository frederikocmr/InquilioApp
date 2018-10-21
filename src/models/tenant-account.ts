import { UserAccount } from "./user-account";

export class TenantAccount extends UserAccount {
    public overallScore: number;
    public paymentScore: number;
    public carefulScore: number;
    public discretionScore: number;
    public realEstateHistory: string[];
    public contracts: string[];

}