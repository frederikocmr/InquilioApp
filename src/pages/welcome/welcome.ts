import { UiProvider } from './../../providers/ui/ui';
import { Component } from '@angular/core';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { FirebaseProvider } from '../../providers';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  loginPage = LoginPage;
  signupPage = SignupPage;
  descriptions;
  
  constructor(
    public ui: UiProvider,
    private firebase: FirebaseProvider,
    private navCtrl: NavController) {
    this.descriptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel lacinia diam. Fusce sed imperdiet neque, sed posuere sapien.',
      'Quisque ornare, tortor vitae accumsan facilisis, tortor ipsum convallis enim, eu volutpat tortor dui eget risus.',
      'Aenean nulla urna, malesuada ut magna eget, lobortis vestibulum est.'];
  }

  doLoginWithGoogle() {
    this.firebase.signInWithGoogle().then(() => {
      this.ui.showToast(this.firebase.message, 3, 'top');

      if (this.firebase.validator) {
        this.navCtrl.setRoot(TabsPage);
      }

    }).catch((error) => {
      console.log(error);
    });
  }

}
