import { Component, Renderer } from '@angular/core';
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import { ViewController, NavParams, Platform } from 'ionic-angular';

@Component({
    selector: 'modal-audio',
    templateUrl: 'modal-audio.html'
})
export class ModalAudioComponent {
  private mediaPlugin : MediaPlugin = null;//Utilizada para startRecord y stopRecord
  private audioMedia : MediaObject = null;//Utilizada para el play, pause y stop
  public item: any;
  public audioTime: number = 0;
  private timeCurrentPosition: any;

  constructor(public viewCtrl: ViewController, private navParams: NavParams,
    public renderer: Renderer, private platform: Platform) {
      this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
      this.mediaPlugin = navParams.get("mediaPlugin");
      this.audioMedia = navParams.get("audioMedia");
      this.item = navParams.get("item");
      this.initAudioTime();
      this.audioMedia.play();
  }

  public play(){
    this.initAudioTime();
    this.audioMedia.play();
  }

  public pause(){
    if(this.audioMedia != null)
      this.audioMedia.pause();
  }

  public stop(){
    if(this.audioMedia != null){
      this.audioMedia.stop();
    }
  }

  private initAudioTime(){
    this.audioTime = 0
    this.timeCurrentPosition = setInterval(() => {
        this.audioMedia.getCurrentPosition()
          .then(time => {
            if(time < 0)
              clearInterval(this.timeCurrentPosition);
            else
              this.audioTime = Math.round(time);
          });
      }, 1000);
  }

  dismiss() {
    this.audioMedia.stop();
    this.viewCtrl.dismiss();
    clearInterval(this.timeCurrentPosition);
  }

}