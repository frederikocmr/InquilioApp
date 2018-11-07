import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from 'firebase';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { regexValidators } from '../../validators/validator';

@Component({
  selector: 'page-profile-form',
  templateUrl: 'profile-form.html',
})
export class ProfileFormPage {
  backgroundClass: string;
  cardColor: string;
  formClass: string;
  iconColor: string;
  textColor: string;
  user: User;
  userType: string;
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

    if (navParams.get('userType')) this.userType = navParams.get('userType');
    else this.userType = "owner";
    this.changeLayout(this.userType);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileFormPage');
  }

  // Changes the color of some elements depending on the type of user
  private changeLayout(user: string): void {
    if (user == "owner") {
      this.backgroundClass = "bg-owner-page";
      this.cardColor = "primary700";
      this.formClass = "custom-form";
      this.iconColor = "light";
      this.textColor = "light-text";
    } else {
      this.backgroundClass = "bg-tenant-page";
      this.cardColor = "light";
      this.formClass = "custom-form-tenant";
      this.iconColor = "primary"
      this.textColor = "primary-text";
    }
  }

  // TODO: Criar método para salvar alterações no perfil
  public saveProfile(): void {
    this.navCtrl.pop();
  }

  public setMaxDate(): number {
    return new Date().getFullYear() - 18;
  }

}
