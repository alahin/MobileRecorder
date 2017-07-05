import { Component, Renderer } from '@angular/core';
import { MediaObject, MediaPlugin } from '@ionic-native/media';
import { ViewController, NavParams, Platform } from 'ionic-angular';

@Component({
    selector: 'modal-recorder',
    templateUrl: 'modal-recorder.html'
})
export class ModalRecorderComponent {
  private audioMedia: MediaObject = null;//Utilizada para startRecord y stopRecord
  private mediaPlugin : MediaPlugin = null;
  public recording: boolean = false;
  public nameFile: string;
  private PATH: string;
  private selectedExtension: string;
  private initialTime: number;
  private timeCurrentPosition: any;
  public actualTime: string;
  public stop: boolean = false;

  constructor(public viewCtrl: ViewController, private navParams: NavParams,
    public renderer: Renderer, private platform: Platform) {
      this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
      this.nameFile = navParams.get("nameFile");
      this.mediaPlugin = navParams.get("mediaPlugin");
      this.PATH = navParams.get("path");
      this.selectedExtension = navParams.get("selectedExtension");
      this.actualTime = new Date(0).toISOString();
  }

  public playRecord(){
    if(!this.recording){
      try {
        this.recording = true;
        this.stop = false;
        // Inicia una nueva grabación
        this.audioMedia = this.mediaPlugin.create(this.PATH+this.nameFile+this.selectedExtension);
        this.audioMedia.startRecord();
        //Obtiene la fecha inicial
        this.initialTime = new Date().getTime();
        this.timeCurrentPosition = setInterval(() => {
          //Obtiene la fecha actual transcurrido 1 segundo
          let actualTime = new Date().getTime();
          //Diferencia entre el inicial y el actual y este será el tiempo a mostrar
          this.actualTime = new Date(actualTime - this.initialTime).toISOString();
        }, 1000);
      }
      catch(e){
        console.log('Exception this.MediaPlugin.startRecord(): '+ JSON.stringify(e));
      }
    }
    else{
      try {
        this.audioMedia.stopRecord();
        clearInterval(this.timeCurrentPosition);
        this.recording = false;
        this.stop = true;
      }
      catch(e){
        console.log('Exception this.MediaPlugin.stopRecord(): '+ JSON.stringify(e));
      }
    }
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

}