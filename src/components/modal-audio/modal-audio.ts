import { Component, Renderer } from '@angular/core';
import { MediaObject } from '@ionic-native/media';
import { ViewController, NavParams, Platform } from 'ionic-angular';

@Component({
    selector: 'modal-audio',
    templateUrl: 'modal-audio.html'
})
export class ModalAudioComponent {
  private audioMedia : MediaObject = null;//Utilizada para el play, pause y stop
  public item: any;

  constructor(public viewCtrl: ViewController, private navParams: NavParams,
    public renderer: Renderer, private platform: Platform) {
      this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
      this.audioMedia = navParams.get("audioMedia");
      this.item = navParams.get("item");
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}