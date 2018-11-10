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
    private fb: FirebaseProvider,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private afDb: AngularFirestore,
    private platform: Platform) {

    this.descriptions = [
      "Para donos de imóveis e inquilinos, gerencie seus aluguéis e tenha controle sobre o período de contrato.",
      "Faça uma avaliação sobre o período do aluguel e encontre usuários bem avaliados."
      // 'Alugue de forma mais segura, encontrando bons usuários prontos para alugar.'
    ];
    this.ui.showLoading();
    this.user = this.afAuth.authState;


  }

  ionViewWillEnter(){
    this.user.subscribe((user) => {
      if(user){
        this.chooseRoot(user.uid);
      } else {
        this.ui.closeLoading();
      }
    });
  }

  public doLoginWithGoogle(): void {
    this.ui.showLoading();
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin().then((user) => {
        console.log(user);
        this.ui.showToast("Sucesso ao logar com o Google.", 3, 'top');
        this.chooseRoot(this.fb.user.uid);

        // this.fb.createNewAccount(objeto user, 'prompt ');
        // TODO - Chamar função que cria usuário.
      }).catch((error) => {
        this.ui.closeLoading();
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
    this.fb.signInWithGoogle().then(() => {
      this.ui.showToast(this.fb.message, 3, 'top');
      
      // aqui usuário escolhe com o prompt se ele quer ser owner ou tenant, nao precisa do choose root
      // if (this.firebase.validator) {
      //   this.chooseRoot();
      // } else {
      //   this.ui.closeLoading();
      // }

    }).catch((error) => {
      this.ui.closeLoading();
      console.log(error);
    });
  }

  public chooseRoot(uid: string): void {
    this.afDb.collection('ownerAccount').doc(uid).snapshotChanges().subscribe(res => {

      if (res.payload.exists) {
        console.log('usuário é owner.');
        this.ui.closeLoading(true);
        
        this.navCtrl.setRoot(TabsPage);
      } else {
        this.ui.closeLoading(true);
        this.navCtrl.setRoot(TenantTabsPage);
      }
    });
  }
}
