import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import firebase from 'firebase/app';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { MyRealEstatePage } from '../pages/my-real-estate/my-real-estate';
import { RealEstateFormPage } from '../pages/real-estate-form/real-estate-form';
import { TabsPage } from '../pages/tabs/tabs';

import { firebaseConfig } from '../providers';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  myRealEstate: any = MyRealEstatePage;
  realEstateForm: any = RealEstateFormPage;
  rootPage: any;
  settingsPage: any = SettingsPage;
  @ViewChild('nav') nav: NavController;

  constructor(
    platform: Platform,
    splashScreen: SplashScreen) {

    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      console.log("onAuthStateChanged");
      if (!user) {
        this.rootPage = HomePage;
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

