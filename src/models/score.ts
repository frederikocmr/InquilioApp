export class Score {
    public tenantId: string;
    public contractId: string;
    public overallScore: number;
    public paymentScore: number;
    public carefulScore: number;
    public contractScore: number;
    public discretionScore: number;
    public date: number;
    public observation: string;

    constructor() {
        this.date = Number(new Date);
        this.overallScore = 0;
        this.paymentScore = 0;
        this.carefulScore = 0;
        this.contractScore = 0;
        this.discretionScore = 0;
    }

}