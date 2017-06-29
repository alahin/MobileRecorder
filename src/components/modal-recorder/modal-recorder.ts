import { Component, Renderer } from '@angular/core';
import { MediaObject } from '@ionic-native/media';
import { ViewController, NavParams, Platform } from 'ionic-angular';

@Component({
    selector: 'modal-recorder',
    templateUrl: 'modal-recorder.html'
})
export class ModalRecorderComponent {
  private audioMedia : MediaObject = null;//Utilizada para el play, pause y stop
  public nameFile: string;

  constructor(public viewCtrl: ViewController, private navParams: NavParams,
    public renderer: Renderer, private platform: Platform) {
      this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
      this.audioMedia = navParams.get("audioMedia");
      this.nameFile = navParams.get("nameFile");
  }

  public play(){
  }

  public pause(){

  }

  public stop(){
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}