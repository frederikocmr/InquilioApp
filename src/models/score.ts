export class Score {
    public tenantId: string;
    public ownerId: string;
    public realStateId: string;
    public overallScore: number;
    public paymentScore: number;
    public carefulScore: number;
    public discretionScore: number;
    public date: Date;
    public observation: string;

    constructor() {
    }

}