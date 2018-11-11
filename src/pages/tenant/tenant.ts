import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  PopoverController,
  ActionSheetController,
  AlertController
} from "ionic-angular";
import { TenantFormPage } from "./tenant-form/tenant-form";
import { TenantDetailsPage } from "./tenant-details/tenant-details";
import { Observable } from "rxjs/Observable";
import { TenantAccount } from "../../models/tenant-account";
import { UiProvider } from "../../providers";
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';
import { ListOptionsComponent } from "../../components/list-options/list-options";
import { ContractFormPage } from "../contract/contract-form/contract-form";

@Component({
  selector: "page-tenant",
  templateUrl: "tenant.html"
})
export class TenantPage {
  evaluationNumber = 1;
  overallScore = "4.8"
  public searchingTenants: boolean = false;
  public tenants: Observable<TenantAccount[]>;
  public tenantsExists: boolean = false;
  public searchString: string = '';

  constructor(
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private afDb: AngularFirestore,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider
  ) {

  }

  public showListener(): void {
    document.getElementById('searchbar').classList.add('keyboard-is-open');
  }

  public hideListener(): void {
    document.getElementById('searchbar').classList.remove('keyboard-is-open');
  }

  public ionViewDidEnter(): void {
    window.addEventListener('keyboardWillShow', this.showListener);
    window.addEventListener('keyboardDidHide', this.hideListener);
  }

  public ionViewWillLeave(): void {
    window.removeEventListener('keyboardWillShow', this.showListener);
    window.removeEventListener('keyboardDidHide', this.hideListener);
  }

  public cancelSearch(): void {
    this.searchingTenants = false;
    this.tenantsExists = false;
    this.tenants = null;
  }

  public presentPopover(myEvent): void {
    let popover = this.popoverCtrl.create(ListOptionsComponent, {type: 'tenant'});
    popover.present({
      ev: myEvent
    });
  }

  public newContract(tenant): void {
    let modal = this.modalCtrl.create(ContractFormPage, {tenantObj: tenant});
    modal.present();
  }

  public newTenant(): void {
    let modal = this.modalCtrl.create(TenantFormPage);
    modal.present();
  }

  public search(): void {
    if (this.searchString.length == 14) {
      //TODO: Quando ativar esta funcao, criar um loading na tela sem ser o do ui...
      this.tenants = this.afDb.collection<TenantAccount>(
        'tenantAccount',
        ref => ref.where("document", "==", this.searchString).where("active", "==", true)
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as TenantAccount;
          const id = a.payload.doc.id;
          data.id = id;
          this.searchingTenants = true;
          this.tenantsExists = true;

          return { id, ...data };
        }))
      );
    }
  }

  public selectContract(): void {
    let alert = this.alertCtrl.create();
    alert.setTitle('Selecione o contrato');

    alert.addInput({
      type: 'radio',
      label: 'Casa',
      value: 'casa',
      checked: false
    });

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Confirmar',
      handler: data => {
        console.log(data)
      }
    });
    alert.present();
  }

  public tenantOptions(tenant: TenantAccount): void {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Escolha uma opção',
      buttons: [
        {
          text: 'Ver detalhes',
          handler: () => {
            this.viewDetails(tenant);
          }
        },{
          text: 'Vincular contrato existente',
          handler: () => {
            this.selectContract();
          }
        },{
          text: 'Vincular novo contrato',
          handler: () => {
            this.newContract(tenant);
          }
        },{
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public viewDetails(tenant): void {
    this.navCtrl.push(TenantDetailsPage, { tenant: tenant });
  }
}
