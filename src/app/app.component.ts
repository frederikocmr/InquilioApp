import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  @ViewChild('nav') nav: NavController;

  constructor(
    platform: Platform,
    splashScreen: SplashScreen) {
      this.rootPage = WelcomePage;


    platform.ready().then(() => {
      // statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}

