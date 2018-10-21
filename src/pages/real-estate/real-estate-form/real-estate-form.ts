import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseProvider, ViacepProvider } from './../../../providers';
import { RealEstate } from './../../../models/real-estate';

@IonicPage()
@Component({
  selector: 'page-real-estate-form',
  templateUrl: 'real-estate-form.html',
})
export class RealEstateFormPage {
  public realEstate: RealEstate = new RealEstate();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FirebaseProvider,
    private viacep: ViacepProvider,
    private toastCtrl: ToastController) { }

  addRealEstate() {
    this.realEstate.ownerId = this.fb.user.uid;
    this.fb.insertDataToCollection('RealEstate', this.realEstate).then((data) => {
      let toast = this.toastCtrl.create({
        message: this.fb.message,
        duration: 2000,
        position: 'top'
      });
      toast.present();

      if (this.fb.validator) {
        this.navCtrl.pop();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  getAddress(cep: string) {
    if (cep.length == 8 && (/^\d+$/.test(cep))) {
      this.viacep.callService(cep)
        .subscribe(
          data => {
            if(data.erro){
              let toast = this.toastCtrl.create({
                message: "ATENÇÃO: CEP INVÁLIDO!",
                duration: 2500,
                position: 'bottom'
              });
              toast.present();
            } else {
              this.realEstate.district = data.bairro;
              this.realEstate.street = data.logradouro;
              this.realEstate.city = data.localidade;
              this.realEstate.state = data.uf;
            }
          }
        );
    }

  }

}
