export class RealEstate {
    public name: string;
    public description: string;
    public zip: string;
    public street: string;
    public number: string;
    public complement: string;
    public district: string;
    public city: string;
    public state: string;
    public type: string;
    public link: string;
    public active: boolean;
    public tenantHistory: string[];
    public ownerId: string;

    constructor() {
        this.active = true;
    }

}