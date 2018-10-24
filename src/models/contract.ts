export class Contract {
  public beginDate: Date;
  public endDate: Date;
  public duration: string;
  public tenantId: string;
  public ownerId: string;
  public realEstateId: string;

  constructor() {
    this.beginDate = null;
    this.endDate = null;
    this.duration = null;
    this.tenantId = null;
    this.ownerId = null;
    this.realEstateId = null;
  }
}
