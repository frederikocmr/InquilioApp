import { RealEstate } from './real-estate';
export class Contract {
  public id: string;
  public active: boolean;
  public beginDate: Date;
  public endDate: Date;
  public duration: string;
  public tenantId: string;
  public ownerId: string;
  public realEstateId: string;
  public realEstate: RealEstate;

  constructor() {
    this.active = true;
    this.beginDate = null;
    this.endDate = null;
    this.duration = null;
    this.tenantId = null;
    this.ownerId = null;
    this.realEstateId = null;
    this.realEstate = null;
  }
}
