import { Component, Input } from '@angular/core';
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import { NativeAudio } from '@ionic-native/native-audio';
import { Platform, ModalController, ViewController } from 'ionic-angular';

@Component({
    selector: 'modal-audio',
    templateUrl: 'modal-audio.html'
})
export class ModalAudioComponent {

  // private audioMedia : MediaObject = null;//Utilizada para el play, pause y stop  
  // private mediaPlugin : MediaPlugin = null;

  constructor(public viewCtrl: ViewController) {
  }

  // public play(event, item){
  //   if(this.audioMedia == null)
  //     this.audioMedia = this.mediaPlugin.create(item.nativeURL);
  //   this.audioMedia.play();
  // }

  // public pause(event, item){
  //   if(this.audioMedia != null)
  //     this.audioMedia.pause();
  // }

  // public stop(event, item){
  //   if(this.audioMedia != null){
  //     this.audioMedia.stop();
  //     this.audioMedia = null;
  //   }
  // }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}