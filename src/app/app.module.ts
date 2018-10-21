import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
//import { BrMaskerModule } from 'brmasker-ionic-3';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MainMenuPage } from '../pages/main-menu/main-menu';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SettingsService } from '../services/settings';
import { SettingsPage } from '../pages/settings/settings';
import { MyRealEstatePage } from '../pages/my-real-estate/my-real-estate';
import { RealEstateFormPage } from '../pages/real-estate-form/real-estate-form';
import { TabsPage } from '../pages/tabs/tabs';

import { FirebaseProvider } from '../providers';
import { RealEstateDetailsPage } from '../pages/real-estate-details/real-estate-details';

export const firebaseConfig = {
  apiKey: "AIzaSyBppMFH3ZlpMoDB4RrDjNx94-ZyASl65-M",
  authDomain: "app-tcc1.firebaseapp.com",
  databaseURL: "https://app-tcc1.firebaseio.com",
  projectId: "app-tcc1",
  storageBucket: "app-tcc1.appspot.com",
  messagingSenderId: "306866070953"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MainMenuPage,
    LoginPage,
    SettingsPage,
    SignupPage,
    MyRealEstatePage,
    RealEstateDetailsPage,
    RealEstateFormPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    //BrMaskerModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MainMenuPage,
    LoginPage,
    SettingsPage,
    SignupPage,
    MyRealEstatePage,
    RealEstateDetailsPage,
    RealEstateFormPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SettingsService,
    FirebaseProvider
  ]
})
export class AppModule {}
