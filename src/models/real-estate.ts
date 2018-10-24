export class RealEstate {
    public id: string;
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
    public imgLink: string;
    public active: boolean;
    public tenantHistory: string[];
    public ownerId: string;
    public contractId: string;

    constructor() {
        this.active = true,
        this.name =  null,
        this.description = null,
        this.zip = null,
        this.street =  null,
        this.number = null,
        this.complement = null,
        this.district = null,
        this.city = null,
        this.state = null,
        this.type = null,
        this.link = null,
        this.active = true,
        this.tenantHistory = [],
        this.ownerId = null
        this.contractId = null,
        this.imgLink = "../assets/imgs/noimage.jpg"
    }

}