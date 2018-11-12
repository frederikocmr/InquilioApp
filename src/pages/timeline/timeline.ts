import { Contract } from './../../models/contract';
import { Component } from "@angular/core";
import { NavController, NavParams, ModalController, AlertController } from "ionic-angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { FirebaseProvider } from "../../providers";
import { History } from "../../models/history";

@Component({
  selector: "page-timeline",
  templateUrl: "timeline.html"
})
export class TimelinePage {
  public backgroundClass: string;
  public cardColor: string;
  public iconColor: string;
  public textColor: string;
  public timeClass: string;
  public itemsData: History[];
  public userType: string;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore
  ) {
    if (navParams.get('userType')) this.userType = navParams.get('userType');
    else this.userType = "owner";

    this.changeLayout(this.userType);

    this.afDb.doc<any>('History/' + this.fb.user.uid).valueChanges().subscribe(
      (data) => {
        if (data) {
          this.itemsData = [];
          let dataKeys = Object.keys(data);

          dataKeys.forEach(element => {
            this.itemsData.push(data[element]);
          });

          this.itemsData.sort(function(a, b) {return a.datetime - b.datetime}).reverse();

        }
      });
  }

  // Changes the color of some elements depending on the type of user
  public changeLayout(user: string): void {
    if (user == "owner") {
      this.backgroundClass = "bg-owner-page";
      this.cardColor = "primary700";
      this.iconColor = "light";
      this.textColor = "light-text";
      this.timeClass = "";
    } else {
      this.backgroundClass = "bg-tenant-page";
      this.cardColor = "light";
      this.iconColor = "primary"
      this.textColor = "primary-text";
      this.timeClass = "primary-text";
    }
  }

  public createNewContractConfirmation(actionObject: any, type: string, datetime: number) {
    console.log(datetime);
    this.afDb.doc<any>(type + '/' + actionObject.id).valueChanges().subscribe(
      (data ) => {
        if (data && (data.tenantId == this.fb.user.uid)) {
          const contract = data as Contract;
          let message = '';
          message += "Data de início: " + contract.beginDate + "\n";
          message += "Data de fim: " + contract.endDate + "\n";
          message += "Duração: " + contract.duration + "\n";
          message += "Endereço do imóvel: Rua Teste Estático \n";
          message = message.replace(/\n/g, "<br />");

          let alert = this.alertCtrl.create({
            title: actionObject.title,
            message: message,
            buttons: [
              {
                text: 'Recusar',
                handler: () => {
                  console.log(actionObject);
                  this.fb.updateDataFromCollection('Contract', {id: actionObject.id, status: "rejected" });
                }
              },
              {
                text: 'Confirmar',
                handler: () => {
                  console.log(actionObject);
                  this.fb.updateDataFromCollection('Contract', {id: actionObject.id, status: "confirmed" });
                }
              }
            ]
          });
          alert.present();
        } else {
          console.log(data.tenantId + " - " + this.fb.user.uid)
        }
      });
  }

  public processTags(text: string){
    text = text.replace(/\n/g, "<br />");
    return text;
  }

  public doAction(item: History): void {
    if (item.action) {
      switch (item.action.show) {
        case 'contractConfirmation':
          this.createNewContractConfirmation(item.action, item.type, Number(item.datetime));
          break;

        default:
          break;
      }
    }
  }

  public getIconName(type: string): string {
    switch (type) {
      case 'User':
        return 'custom-border-account-circle';
      case 'OwnerAccount':
        return 'custom-border-owner';
      case 'TenantAccount':
        return 'custom-border-users';
      case 'Contract':
        return 'custom-border-contract';
      case 'RealEstate':
        return 'custom-border-home';
      case 'EvaluationPending':
        return 'custom-border-star-border';
      case 'EvaluationDone':
        return 'custom-border-user-ok';
      default:
        return 'custom-border-timeline';
    }
  }

}
