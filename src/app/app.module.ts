import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
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

import { FirebaseProvider, firebaseConfig, ViacepProvider } from '../providers';
import { RealEstateDetailsPage } from '../pages/real-estate/real-estate-details/real-estate-details';
import { ContractPage } from '../pages/contract/contract';
import { ContractFormPage } from '../pages/contract/contract-form/contract-form';
import { ContractDetailsPage } from '../pages/contract/contract-details/contract-details';
import { TenantPage } from '../pages/tenant/tenant';
import { TenantFormPage } from '../pages/tenant/tenant-form/tenant-form';
import { TenantDetailsPage } from '../pages/tenant/tenant-details/tenant-details';
import { UiProvider } from '../providers/ui/ui';
import { Keyboard } from "@ionic-native/keyboard";

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
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: false,
      autoFocusAssist: false
    }),
    AngularFireModule.initializeApp(firebaseConfig),
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
    SettingsService,
    FirebaseProvider,
    Keyboard,
    ViacepProvider,
    UiProvider 
  ]
})
export class AppModule {}
