import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { MyRealEstatePage } from '../pages/my-real-estate/my-real-estate';
import { RealEstateFormPage } from '../pages/real-estate-form/real-estate-form';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  myRealEstate:any = MyRealEstatePage;
  realEstateForm: any = RealEstateFormPage;
  rootPage:any = HomePage;
  settingsPage:any = SettingsPage;
  @ViewChild('nav') nav: NavController;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private menuCtrl: MenuController) {
    platform.ready().then(() => {
      // statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  onLoad(page: any) {
    if (page == 'rootPage') {
      this.nav.setRoot(page);
    } else {
      this.nav.push(page);
    }
    this.menuCtrl.close();
  }
}

