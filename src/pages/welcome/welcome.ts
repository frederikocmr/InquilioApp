import { GooglePlus } from '@ionic-native/google-plus';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/Observable';
import { UiProvider } from './../../providers/ui/ui';
import { Component } from '@angular/core';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { FirebaseProvider } from '../../providers';
import { NavController, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';



@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  loginPage = LoginPage;
  signupPage = SignupPage;
  descriptions;
  user: Observable<firebase.User>;

  constructor(
    public ui: UiProvider,
    private firebase: FirebaseProvider,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private platform: Platform) {

    this.descriptions = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel lacinia diam. Fusce sed imperdiet neque, sed posuere sapien.',
      'Quisque ornare, tortor vitae accumsan facilisis, tortor ipsum convallis enim, eu volutpat tortor dui eget risus.',
      'Aenean nulla urna, malesuada ut magna eget, lobortis vestibulum est.'
    ];

    this.user = this.afAuth.authState;

  }

  doLoginWithGoogle() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }

  }

  async nativeGoogleLogin(): Promise<firebase.User> {

    try {
      const gPlusUser = await this.gplus.login({
        'webClientId': '306866070953-2m56s5983v0b17lh0hu51ckh1bo3urn0.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      });

      return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken));

    } catch (error) {
      console.log(error);
    }
  }


  async webGoogleLogin(): Promise<void> {
    try {
      this.firebase.signInWithGoogle().then(() => {
        this.ui.showToast(this.firebase.message, 3, 'top');

        if (this.firebase.validator) {
          this.navCtrl.setRoot(TabsPage);
        }

      }).catch((error) => {
        console.log(error);
      });
    } catch (error) {

    }

  }






}
