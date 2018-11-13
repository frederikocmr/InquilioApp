import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  ActionSheetController,
  AlertController
} from "ionic-angular";
import { TenantFormPage } from "./tenant-form/tenant-form";
import { TenantDetailsPage } from "./tenant-details/tenant-details";
import { Observable } from "rxjs/Observable";
import { TenantAccount } from "../../models/tenant-account";
import { UiProvider, FirebaseProvider } from "../../providers";
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';
import { ContractFormPage } from "../contract/contract-form/contract-form";
import { Contract } from "../../models/contract";

@Component({
  selector: "page-tenant",
  templateUrl: "tenant.html"
})
export class TenantPage {
  public evaluationNumber = 1;
  public overallScore = "4.8"
  public searchingTenants: boolean = false;
  public tenants: Observable<TenantAccount[]>;
  public tenantsExists: boolean = false;
  public searchString: string = '000.000.000-00'; // apenas para teste
  public contracts: Contract[];
  
  constructor(
    private modalCtrl: ModalController,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider
  ) {
    this.search(); // apenas para teste
    this.getContracts();
  }

  public getContracts(){
    this.afDb.collection<Contract>(
      'Contract',
      ref => ref.where('ownerId', '==', this.fb.user.uid)
      .where("active", "==", true)
      .where("status", "==", "detached")
    ).valueChanges().subscribe((data) =>{
      if(data.length > 0){
        this.contracts = data;
      } else {
        this.contracts = null;
      }
    });
    
  }

  public showListener(): void {
    document.getElementById('searchbar').classList.add('keyboard-open');
  }

  public hideListener(): void {
    document.getElementById('searchbar').classList.remove('keyboard-open');
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
    if(this.contracts ){
      let alert = this.alertCtrl.create();
      alert.setTitle('Selecione o contrato');
    
        this.contracts.forEach(contract => {
          alert.addInput({
            type: 'radio',
            label: "Imóvel: Casa X\n" + " Duração: "+ contract.duration,
            value: contract.id,
            checked: false
          });
  
        });

      alert.addButton('Cancelar');
      alert.addButton({
        text: 'Confirmar',
        handler: data => {
          //update no contrato com tenantID preenchido
          console.log(data)
        }
      });
      alert.present();
    } else {
      this.ui.showAlert("Aviso", "Nenhum contrato cadastrado que esteja disponível!");
    }
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
