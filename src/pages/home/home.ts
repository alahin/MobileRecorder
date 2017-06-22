import { Component } from '@angular/core';
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import { NativeAudio } from '@ionic-native/native-audio';
import { AlertController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  private mediaObject: MediaObject = null;
  public recording: boolean = false;
  public nameFile: string = "";
  public DIRECTORY_NAME: string = "Recordings";
  public selectedExtension : string = "";
  public fileList : Array<any>;

  public extensions = [
    { display: 'mp3', value: '.mp3' },
    { display: '3gp', value: '.3gp' },
    { display: 'wav', value: '.wav' }
  ];

  constructor(public alertCtrl: AlertController, public platform: Platform,
    private file: File, public nativeAudio: NativeAudio) {
      
  }

  ionViewWillEnter(){
    console.log("ionViewWillEnter");
    this.platform.ready().then(() => {
      this.obtainFileList();
    });
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
      
      this.mediaObject = mediaPlugin.create(this.file.externalRootDirectory+this.DIRECTORY_NAME+"/"+this.nameFile+this.selectedExtension,
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
    if(this.nameFile != "" && this.selectedExtension != ""){
      if(!this.recording){
        try {
          //Inicia una nueva grabación
          this.MediaPlugin.startRecord();
          this.recording = true;
        }
        catch(e){
          this.showAlert('Exception this.MediaPlugin.startRecord(): '+ JSON.stringify(e));
        }
      }
      else{
        try {
          //Detiene la grabación
          this.MediaPlugin.stopRecord();
          this.mediaObject = null;
          this.recording = false;
          this.obtainFileList();
        }
        catch(e){
          this.showAlert('Exception this.MediaPlugin.stopRecord(): '+ JSON.stringify(e));
        }
      }
    }
    else{
      this.showAlert("Inserta un nombre y una extensión para el fichero.");
    }
  }
 
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  /**
   * Obtiene la lista de archivos de audio
   */
  obtainFileList(){
    //obtiene la lista de archivos de audio en el directorio
    this.file.listDir(this.file.externalRootDirectory, this.DIRECTORY_NAME)
      .then(result => {
        this.fileList = result;
      })
      .catch(e => {
        console.log("error result list::::", e);
      });
  }

  playAudioRecorded(event, item){
    let pathOnly = item.nativeURL.substring(8);
    let mediaPlugin = new MediaPlugin();
    let fileAudio = mediaPlugin.create(pathOnly);
    fileAudio.play();
  }

  deleteAudioRecorded(event, item){
    this.file.removeFile(this.file.externalRootDirectory+this.DIRECTORY_NAME, item.name)
      .then(result => {
        this.obtainFileList();
      })
      .catch(e => {
        console.log("Error al eliminar el archivo::::", e);
      });
  }

}
