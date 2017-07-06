import { Component, Renderer } from '@angular/core';
import { MediaObject } from '@ionic-native/media';
import { ViewController, NavParams, Events} from 'ionic-angular';

@Component({
    selector: 'modal-audio',
    templateUrl: 'modal-audio.html'
})
export class ModalAudioComponent {
  public audioMedia : MediaObject;//Utilizada para el play, pause y stop
  public item: any;

  constructor(public viewCtrl: ViewController, private navParams: NavParams,
    public renderer: Renderer, private events: Events) {
      this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
      this.audioMedia = navParams.get("audioMedia");
      this.item = navParams.get("item");
  }

  dismiss() {
    this.viewCtrl.dismiss();
    this.events.publish('stopAudioTime');
  }

}