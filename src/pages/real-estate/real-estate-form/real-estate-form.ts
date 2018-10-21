import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider, ViacepProvider } from './../../../providers';
import { RealEstate } from './../../../models/real-estate';
import { UiProvider } from '../../../providers/ui/ui';

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
    public ui: UiProvider,
    private fb: FirebaseProvider,
    private viacep: ViacepProvider) { }

  addRealEstate() {
    this.ui.showLoading();
    this.realEstate.ownerId = this.fb.user.uid;
    this.fb.insertDataToCollection('RealEstate', this.realEstate).then((data) => {
      this.ui.closeLoading();
      this.ui.showToast(this.fb.message, 2, 'top');

      if (this.fb.validator) {
        this.navCtrl.pop();
      }
    }).catch((error) => {
      this.ui.showAlert("Erro ao cadastrar", error);
    });
  }

  getAddress(cep: string) {
    if (cep.length == 8 && (/^\d+$/.test(cep))) {
      this.viacep.callService(cep)
        .subscribe(
          data => {
            if (data.erro) {
              this.ui.showToast("ATENÇÃO: CEP INVÁLIDO!", 2, 'bottom');
            } else {
              // TODO: desabilitar estes campos para usuário não editar.
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
