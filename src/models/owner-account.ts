import { UserAccount } from "./user-account";

export class OwnerAccount extends UserAccount {
    public realEstatesOwned: string[];
    public contracts: string[];

}