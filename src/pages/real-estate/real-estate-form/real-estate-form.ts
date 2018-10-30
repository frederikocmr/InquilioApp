import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider, ViacepProvider, UiProvider } from './../../../providers';
import { RealEstate } from './../../../models/real-estate';

@IonicPage()
@Component({
  selector: 'page-real-estate-form',
  templateUrl: 'real-estate-form.html',
})
export class RealEstateFormPage {
  public realEstate: RealEstate = new RealEstate();
  public editing: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private fb: FirebaseProvider,
    private viacep: ViacepProvider) { 
      if(this.navParams.get('realEstateObj')){
        this.realEstate = navParams.get('realEstateObj');
        this.editing = true;
      }
  }

  // TODO: implementar método para capturar ou importar imagem
  // exemplo em https://devdactic.com/ionic-2-images/

  addRealEstate() {
    this.ui.showLoading();
    if(!this.editing){
      this.realEstate.ownerId = this.fb.user.uid;
      this.fb.insertDataToCollection('RealEstate', this.realEstate).then(() => {
        this.ui.closeLoading();
        this.ui.showToast(this.fb.message, 2, 'top');
  
        if (this.fb.validator) {
          this.navCtrl.pop();
        }
      }).catch((error) => {
        this.ui.closeLoading();
        this.ui.showAlert("Erro ao cadastrar", error);
      });
    } else {

      this.fb.updateDataFromCollection('RealEstate', this.realEstate).then(() => {
        this.ui.closeLoading();
        this.ui.showToast(this.fb.message, 2, 'top');
  
        if (this.fb.validator) {
          this.navCtrl.pop();
        }
      }).catch((error) => {
        this.ui.closeLoading();
        this.ui.showAlert("Erro ao editar", error);
      });

    }
    
  }

  getAddress(cep: string) {
    if (cep) {
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

}
