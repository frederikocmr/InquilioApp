import { Component } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { NavController, NavParams, normalizeURL } from 'ionic-angular';
import { FirebaseProvider, ViacepProvider, UiProvider } from './../../../providers';
import { RealEstate } from './../../../models/real-estate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-real-estate-form',
  templateUrl: 'real-estate-form.html',
})
export class RealEstateFormPage {
  public realEstate: RealEstate = new RealEstate();
  public realEstateForm: FormGroup;
  public editing: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    public imagePicker: ImagePicker,
    public cropService: Crop,
    private fb: FirebaseProvider,
    private viacep: ViacepProvider) {
    if (this.navParams.get('realEstateObj')) {
      this.realEstate = navParams.get('realEstateObj');
      this.editing = true;
    }

    this.realEstateForm = this.formBuilder.group({
      name: [this.realEstate.name ? this.realEstate.name : "", Validators.required],
      link: [this.realEstate.link ? this.realEstate.link : ""],
      type: [this.realEstate.type ? this.realEstate.type : "", Validators.required],
      description: [this.realEstate.description ? this.realEstate.description : ""],
      zip: [this.realEstate.zip ? this.realEstate.zip : "", Validators.required],
      street: [this.realEstate.street ? this.realEstate.street : "", Validators.required],
      district: [this.realEstate.district ? this.realEstate.district : "", Validators.required],
      city: [this.realEstate.city ? this.realEstate.city : "", Validators.required],
      state: [this.realEstate.state ? this.realEstate.state : "", Validators.required],
    });
  }

  public getValuesFromForm(): void {
    let newObject = this.realEstateForm.value as RealEstate;
    this.realEstate.name = newObject.name;
    this.realEstate.link = newObject.link;
    this.realEstate.type = newObject.type;
    this.realEstate.description = newObject.description;
    this.realEstate.zip = newObject.zip;
    this.realEstate.street = newObject.street;
    this.realEstate.district = newObject.district;
    this.realEstate.city = newObject.city;
    this.realEstate.state = newObject.state;
  }

  // TODO: implementar método para capturar ou importar imagem
  // exemplo em https://devdactic.com/ionic-2-images/

  public addRealEstate(): void {
    this.ui.showLoading();
    this.getValuesFromForm();
    if (!this.editing) {
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

  public getAddress(cep: string): void {
    if (cep) {
      cep = cep.replace('-', '');
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
            });
      }
    }
  }

  public openImagePickerCrop(): any{
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.cropService.crop(results[i], {quality: 75}).then(
                  newImage => {
                    this.uploadImageToFirebase(newImage);
                  },
                  error => console.error("Erro ao cortar imagem", error)
                );
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  public openImagePicker(): any{
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.uploadImageToFirebase(results[i]);
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  public uploadImageToFirebase(image): any{
    image = normalizeURL(image);
    let imageName = new Date().toString(); 
    this.fb.uploadImage(image, imageName)
    .then(photoURL => {
        this.ui.showToast('Imagem enviada com sucesso', 3, 'top');
        this.ui.showAlert('Tire print desse link e me mande', photoURL);
      });
  }

}
