import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';
import { StatusBar } from '@ionic-native/status-bar';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('nav') nav: NavController;
  rootPage: any;

  constructor(
    platform: Platform,
    splashScreen: SplashScreen,
    statusBar: StatusBar) {
      this.rootPage = WelcomePage;


    platform.ready().then(() => {
      statusBar.styleLightContent();
      statusBar.overlaysWebView(false);
      splashScreen.hide();
    });
  }

}

