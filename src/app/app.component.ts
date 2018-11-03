import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import firebase from 'firebase/app';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';
import { TabsPage } from '../pages/tabs/tabs';

import { firebaseConfig } from '../providers';

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
      if (!user) {
        this.rootPage = WelcomePage;
      } else {
        this.rootPage = TabsPage;
      }
    });

    platform.ready().then(() => {
      // statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}

