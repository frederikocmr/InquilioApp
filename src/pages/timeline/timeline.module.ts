import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimelinePage } from './timeline';

@NgModule({
  declarations: [
    TimelinePage,
  ],
  imports: [
    IonicPageModule.forChild(TimelinePage),
  ],
	schemas: [ NO_ERRORS_SCHEMA ]
})
export class TimelinePageModule {}
