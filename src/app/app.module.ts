import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http'
//import { BrMaskerModule } from 'brmasker-ionic-3';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { MyApp } from './app.component';
import { WelcomePage } from '../pages/welcome/welcome';
import { TimelinePage } from '../pages/timeline/timeline';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SettingsService } from '../services/settings';
import { SettingsPage } from '../pages/settings/settings';
import { RealEstatePage } from '../pages/real-estate/real-estate';
import { RealEstateFormPage } from '../pages/real-estate/real-estate-form/real-estate-form';
import { TabsPage } from '../pages/tabs/tabs';

import { FirebaseProvider, firebaseConfig, ViacepProvider, SettingsProvider, UiProvider } from '../providers';
import { RealEstateDetailsPage } from '../pages/real-estate/real-estate-details/real-estate-details';
import { ContractPage } from '../pages/contract/contract';
import { ContractFormPage } from '../pages/contract/contract-form/contract-form';
import { ContractDetailsPage } from '../pages/contract/contract-details/contract-details';
import { TenantPage } from '../pages/tenant/tenant';
import { TenantFormPage } from '../pages/tenant/tenant-form/tenant-form';
import { TenantDetailsPage } from '../pages/tenant/tenant-details/tenant-details';
import { Keyboard } from "@ionic-native/keyboard";
import { TenantTabsPage } from '../pages/tenant-tabs/tenant-tabs';


export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new SettingsProvider(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    TimelinePage,
    LoginPage,
    SettingsPage,
    SignupPage,
    RealEstatePage,
    RealEstateDetailsPage,
    RealEstateFormPage,
    TabsPage,
    TenantTabsPage,
    ContractPage,
    ContractDetailsPage,
    ContractFormPage,
    TenantPage,
    TenantFormPage,
    TenantDetailsPage
  ],
  imports: [
    BrowserModule,
    // BrMaskerModule,
    IonicModule.forRoot(MyApp),
    // IonicModule.forRoot(MyApp, {
    //   scrollPadding: true,
    //   scrollAssist: true,
    //   autoFocusAssist: true
    // }),
    AngularFireModule.initializeApp(firebaseConfig),
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    TimelinePage,
    LoginPage,
    SettingsPage,
    SignupPage,
    RealEstatePage,
    RealEstateDetailsPage,
    RealEstateFormPage,
    TabsPage,
    TenantTabsPage,
    ContractPage,
    ContractDetailsPage,
    ContractFormPage,
    TenantPage,
    TenantFormPage,
    TenantDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: SettingsProvider, useFactory: provideSettings, deps: [Storage] },
    SettingsService,
    FirebaseProvider,
    Keyboard,
    ViacepProvider,
    UiProvider,
    GooglePlus
  ]
})
export class AppModule {}
