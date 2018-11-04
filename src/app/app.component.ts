import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import firebase from 'firebase/app';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';

import { firebaseConfig } from '../providers';
import { TenantTabsPage } from '../pages/tenant-tabs/tenant-tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  @ViewChild('nav') nav: NavController;

  constructor(
    platform: Platform,
    splashScreen: SplashScreen) {

    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      // console.log("onAuthStateChanged");

      // TODO: Remover rootPage daqui, e sempre colocar para ir no WelcomePage, e de lá que verifica a rootPage...
      if (!user) {
        this.rootPage = WelcomePage;
      } else {
        this.rootPage = TenantTabsPage;
      }
    });

    platform.ready().then(() => {
      // statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}

