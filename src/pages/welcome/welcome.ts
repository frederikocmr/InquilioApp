import { Component } from '@angular/core';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { FirebaseProvider } from '../../providers';
import { NavController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  loginPage = LoginPage;
  signupPage = SignupPage;
  descriptions;
  
  constructor(private firebase: FirebaseProvider,
    private navCtrl: NavController,
    private toastCtrl: ToastController) {
    this.descriptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel lacinia diam. Fusce sed imperdiet neque, sed posuere sapien.',
      'Quisque ornare, tortor vitae accumsan facilisis, tortor ipsum convallis enim, eu volutpat tortor dui eget risus.',
      'Aenean nulla urna, malesuada ut magna eget, lobortis vestibulum est.'];
  }

  doLoginWithGoogle() {
    this.firebase.signInWithGoogle().then(() => {
      let toast = this.toastCtrl.create({
        message: this.firebase.message,
        duration: 3000,
        position: 'top'
      });
      toast.present();

      if (this.firebase.validator) {
        this.navCtrl.setRoot(TabsPage);
      }

    }).catch((error) => {
      console.log(error);
    });
  }

}