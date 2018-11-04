import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { FirebaseProvider, UiProvider } from '../../providers';
import { NavController, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AngularFirestore } from '@angular/fire/firestore';
import { TenantTabsPage } from '../tenant-tabs/tenant-tabs';



@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  public loginPage = LoginPage;
  public signupPage = SignupPage;
  public descriptions;
  public user: Observable<firebase.User>;

  constructor(
    public ui: UiProvider,
    private firebase: FirebaseProvider,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private afDb: AngularFirestore,
    private platform: Platform) {

    this.descriptions = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel lacinia diam. Fusce sed imperdiet neque, sed posuere sapien.',
      'Quisque ornare, tortor vitae accumsan facilisis, tortor ipsum convallis enim, eu volutpat tortor dui eget risus.',
      'Aenean nulla urna, malesuada ut magna eget, lobortis vestibulum est.'
    ];

    this.user = this.afAuth.authState;

  }

  public doLoginWithGoogle(): void {
    this.ui.showLoading();
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin().then(() => {
        this.ui.showToast("Sucesso ao logar com o Google.", 3, 'top');
        this.chooseRoot();

        // TODO - Chamar função que cria usuário.
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.webGoogleLogin();
    }

  }

  async nativeGoogleLogin(): Promise<firebase.User> {
    
    try {
      const gPlusUser = await this.gplus.login({
        'webClientId': '306866070953-h9r4p5avi00ae1qq2vch0cgr6k2dtbon.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      });

      return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken));

    } catch (error) {
      console.log(error);
    }
  }


  public webGoogleLogin(): void {
    this.firebase.signInWithGoogle().then(() => {
      this.ui.showToast(this.firebase.message, 3, 'top');

      if (this.firebase.validator) {
        this.chooseRoot();
      }

    }).catch((error) => {
      console.log(error);
    });
  }

  public chooseRoot(): void {
    this.afDb.collection('ownerAccount').doc(this.firebase.user.uid).snapshotChanges().subscribe(res => {

      if (res.payload.exists) {
        this.ui.closeLoading();
        console.log('usuário é owner.');
        this.navCtrl.setRoot(TabsPage);
      } else {
        this.ui.closeLoading();
        this.navCtrl.setRoot(TenantTabsPage);
      }
    });
  }






}
