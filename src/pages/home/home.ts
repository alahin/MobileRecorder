import { Component } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private mediaObject: MediaObject = null;
  public recording: boolean = false;
  public nameFile: string = null;
  public DIRECTORY_NAME: string = "Recordings";
  public isButtonEnabled : boolean = false;

  constructor(private speechRecognition: SpeechRecognition, private tts: TextToSpeech,
    public alertCtrl: AlertController, public navCtrl: NavController, public platform: Platform,
    private file: File) {
  }

  get MediaPlugin(): MediaObject {
    console.log("get MediaPlugin this.mediaObject:: ", JSON.stringify(this.mediaObject));
    if (this.mediaObject == null) {
      console.log("this.mediaObject == null");
      let mediaPlugin = new MediaPlugin();
      
      //crea el directorio si no existe
      this.file.createDir(this.file.externalRootDirectory, this.DIRECTORY_NAME, false)
        .then(result =>{
          console.log("result createDir::::", result);
        })
        .catch(e => {
          console.log("error createDir::::", e);
        });
      
      //obtiene la lista de archivos de audio en el directorio
      // this.file.listDir(this.file.externalRootDirectory, this.DIRECTORY_NAME)
      //   .then(result => {
      //     console.log("result list::::", result);
      //   })
      //   .catch(e => {
      //     console.log("error result list::::", e);
      //   });
      
      this.mediaObject = mediaPlugin.create(this.file.externalRootDirectory+this.DIRECTORY_NAME+"/"+this.nameFile,
        function() {
            console.log("[mediaSuccess]");
        }, function(err) {
            console.log("[mediaError]"+ JSON.stringify(err));
        }, function(status) {
            console.log("[mediaStatus]"+ JSON.stringify(status));
        });
    }
    return this.mediaObject;
  }
 
  startRecording() {
    if(!this.recording){
      try {
        console.log("startRecording this.mediaObject:: ", this.mediaObject);
        this.MediaPlugin.startRecord();
        this.recording = true;
      }
      catch(e){
        this.showAlert('Exception this.MediaPlugin.startRecord(): '+ JSON.stringify(e));
      }
    }
    else{
      try {
        console.log("startRecording this.mediaObject:: ", this.mediaObject);
        //Para la grabación
        this.MediaPlugin.stopRecord();
        this.mediaObject = null;
        this.recording = false;
      }
      catch(e){
        this.showAlert('Exception this.MediaPlugin.stopRecord(): '+ JSON.stringify(e));
      }
    }
  }
 
  // playRecording() {
  //   try {
  //     this.MediaPlugin.play();
  //   }
  //   catch (e) {
  //     this.showAlert('Error: '+ e);
  //   }
  // }
 
  // stopRecordingPlay() {
  //   try {
  //     this.MediaPlugin.stop();
  //     this.MediaPlugin.release();
  //   }
  //   catch (e) {
  //     this.showAlert('Error: '+ e);
  //   }
  // }
 
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  runTimeChange(searchTerm) {
    console.log("searchTerm:: ", searchTerm);
  }
  test(){
    console.log("eeeeeeeeeeeeee");
  }


  // listenForSpeech():void {
  //   this.speechRecognition.startListening()
  //     .subscribe(
  //       (matches: Array<string>) => console.log(matches),
  //       (onerror) => console.log('error:', onerror)
  //   )
  // }

  // async getSupportedLanguages():Promise<Array<string>> {
  //   try{
  //     const languages = await this.speechRecognition.getSupportedLanguages();
  //     console.log(languages);
  //     return languages;
  //   }
  //   catch(e){
  //     console.log(e);
  //   }
  // }

  // async hasPermission():Promise<boolean> {
  //   try{
  //     const permission = await this.speechRecognition.hasPermission();
  //     console.log(permission);
  //     return permission;
  //   }
  //   catch(e){
  //     console.log(e);
  //   }
  // }

  // async getPermission():Promise<void> {
  //   try{
  //     const permission = await this.speechRecognition.requestPermission();
  //     console.log(permission);
  //   }
  //   catch(e){
  //     console.log(e);
  //   }
  // }

  // async isSpeechSupported():Promise<boolean> {
  //   const isAvailable = await this.speechRecognition.isRecognitionAvailable();
  //   console.log(isAvailable);
  //   return isAvailable;
  // }



}
