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
  public audioTime: number = 0;
  private timeCurrentPosition: any;
  public minTime: number = 0;
  public maxTime: number;

  constructor(public viewCtrl: ViewController, private navParams: NavParams,
    public renderer: Renderer, private platform: Platform) {
      this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
      this.audioMedia = navParams.get("audioMedia");
      this.item = navParams.get("item");
      this.getDuration();      
      this.initAudioTime();
      this.audioMedia.play();
  }

  public play(){
    this.initAudioTime();
    this.audioMedia.play();
  }

  public pause(){
    this.audioMedia.pause();
  }

  public stop(){
    this.audioMedia.stop();
    this.audioTime = 0;
  }

  private initAudioTime(){
    if(this.audioTime == 0){
      this.timeCurrentPosition = setInterval(() => {
          this.audioMedia.getCurrentPosition()
            .then(time => {
              if(time < 0){
                clearInterval(this.timeCurrentPosition);
                this.audioTime = 0;
              }
              else
                this.audioTime = Math.round(time);
                this.minTime = Math.round(time);
            });
        }, 1000);
    }
  }

  /**
   * Devuelve el tiempo máximo en segundos
   * del archivo de audio.
   * Ha sido necesario meterlo dentro de un inteval.
   */
  private getDuration(){
    let time = setInterval(() => {
        this.maxTime = Math.round(this.audioMedia.getDuration());
        clearInterval(time);
      }, 100);
  }

  dismiss() {
    this.audioMedia.stop();
    this.viewCtrl.dismiss();
    clearInterval(this.timeCurrentPosition);
  }
  
  someFunction(e){
    console.log("event:::: ", e);
  }

}