import { UserAccount } from "./user-account";

export class OwnerAccount extends UserAccount {
    public realStateOwned: string[];
    public contracts: string[];

}