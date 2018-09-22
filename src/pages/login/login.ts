import { Component } from '@angular/core';
import { MainMenuPage } from '../main-menu/main-menu';

import { SignupPage } from '../signup/signup';
import { FirebaseProvider } from '../../providers';
import { ToastController, NavController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  mainMenuPage = MainMenuPage;
  signupPage = SignupPage;
  email: string = "";
  password: string = "";

  constructor(private firebase: FirebaseProvider,
              private toastCtrl: ToastController,
              public navCtrl: NavController){}

  doLoginWithGoogle() {
    this.firebase.signInWithGoogle().then(() => {
			let toast = this.toastCtrl.create({
				message: this.firebase.message,
				duration: 2000,
				position: 'top'
			});
      toast.present();

			if(this.firebase.validator) {
				this.navCtrl.push(MainMenuPage);
      }
      
    }).catch((error) => {
      console.log(error);
    });
  }

  doLoginWithEmail() {
    this.firebase.signIn(this.email, this.password).then(() => {
			let toast = this.toastCtrl.create({
				message: this.firebase.message,
				duration: 2000,
				position: 'top'
			});
      toast.present();

			if(this.firebase.validator) {
				this.navCtrl.push(MainMenuPage);
      }
      
    }).catch((error) => {
      console.log(error);
    });
  }
}
