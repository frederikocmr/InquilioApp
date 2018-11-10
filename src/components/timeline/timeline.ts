import { Component, Input } from '@angular/core';

@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class TimelineComponent {
  @Input('endIcon') endIcon = "ionic";
  constructor() {
  }

}

@Component({
  selector: 'timeline-item',
  template: '<ng-content></ng-content>'
})
export class TimelineItemComponent{
  constructor(){

  }
}

@Component({
  selector:'timeline-time',
  template: '<span>{{ datetime | date:"EEEE" }}</span>' + 
  '<span>{{ datetime | date:"d/M/yy - HH:mm" }}</span>'
})
export class TimelineTimeComponent{
  @Input('datetime') datetime: number; 
  public day = new Date(this.datetime).getDate() ;

  constructor(){
  }
}