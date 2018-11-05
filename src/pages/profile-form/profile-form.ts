import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from 'firebase';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { regexValidators } from '../../validators/validator';

@IonicPage()
@Component({
  selector: 'page-profile-form',
  templateUrl: 'profile-form.html',
})
export class ProfileFormPage {
  user: User;
  profileForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {

    if (navParams.get('user')) this.user = navParams.get('user');

    this.profileForm = this.formBuilder.group({
      document: ['', Validators.compose([Validators.pattern(regexValidators.cpfCpnj), Validators.required])],
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.pattern(regexValidators.email), Validators.required])],
      password: ['', Validators.required],
      phone: ['', Validators.compose([Validators.pattern(regexValidators.phone), Validators.required])],
      birthdate: ['', Validators.required],
      genre: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileFormPage');
  }

  // TODO: Criar método para salvar alterações no perfil
  saveProfile() {
    this.navCtrl.pop();
  }

  public setMaxDate(): number {
    return new Date().getFullYear() - 18;
  }

}
