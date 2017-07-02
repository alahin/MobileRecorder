import { Component } from '@angular/core';
import { MediaPlugin, MediaObject } from '@ionic-native/media';
import { AlertController, Platform, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { ModalAudioComponent } from '../../components/modal-audio/modal-audio';
import { ModalRecorderComponent } from '../../components/modal-recorder/modal-recorder';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage { 
  private audioMedia : MediaObject = null;//Utilizada para el play, pause y stop
  private mediaPlugin : MediaPlugin = null;
  private DIRECTORY_NAME: string = "Recordings";
  public nameFile: string = "";
  public selectedExtension : string = "";
  private fileList : Array<any>;
  private PATH : string = this.file.externalRootDirectory+this.DIRECTORY_NAME+"/";

  public extensions = [
    { display: 'mp3', value: '.mp3' },
    { display: '3gp', value: '.3gp' },
    { display: 'wav', value: '.wav' }
  ];

  constructor(private alertCtrl: AlertController, private platform: Platform,
    private file: File, private modalCtrl: ModalController) {
      this.platform.ready().then(() => {
        //crea el directorio si no existe
        this.createDirectory();
        //Inicializa el plugin
        this.mediaPlugin = new MediaPlugin();
      });
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
 
  public startRecord() {
    if(this.nameFile != "" && this.selectedExtension != ""){
      let contactModal = this.modalCtrl.create(ModalRecorderComponent, {nameFile: this.nameFile, mediaPlugin: this.mediaPlugin, 
        path: this.PATH, selectedExtension: this.selectedExtension}, {enableBackdropDismiss: false});
      contactModal.onDidDismiss(data => {
        this.obtainFileList();
      });
      contactModal.present();
    }
    else{
      this.showAlert("Inserta un nombre y una extensión para el fichero.");
    }
  }

  public play(event, item){
    if(this.audioMedia == null)
      this.audioMedia = this.mediaPlugin.create(item.nativeURL);

    let contactModal = this.modalCtrl.create(ModalAudioComponent, {mediaPlugin: this.mediaPlugin, audioMedia: this.audioMedia, item: item}, {enableBackdropDismiss: false});
    contactModal.present()
      .then(success => {
        this.audioMedia = null;
      })
      .catch(e => {
        console.log("Error al abrir la ventana modal::::", e);
      });
    
  }

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

  public deleteFile(event, item){
    this.file.removeFile(this.file.externalRootDirectory+this.DIRECTORY_NAME, item.name)
      .then(result => {
        this.obtainFileList();
      })
      .catch(e => {
        console.log("Error al eliminar el archivo::::", e);
      });
  }

  /**
   * Obtiene la lista de archivos de audio
   */
  private obtainFileList(){
    //obtiene la lista de archivos de audio en el directorio
    this.file.listDir(this.file.externalRootDirectory, this.DIRECTORY_NAME)
      .then(result => {
        this.fileList = result;
      })
      .catch(e => {
        console.log("error result list::::", e);
      });
  }

  /**
   * Crea el directorio donde se guardarán 
   * los ficheros de audio. Y si ya existe
   * obtiene todos los ficheros de audio.
   */
  private createDirectory(){
    this.file.checkDir(this.file.externalRootDirectory, this.DIRECTORY_NAME)
      .then(success => {
        if(!success){
          this.file.createDir(this.file.externalRootDirectory, this.DIRECTORY_NAME, false)
            .then(success =>{
              if(success){
                this.obtainFileList();
              }
              else{
                this.showAlert("No se ha podido crear el directorio.");
              }
            })
            .catch(e => {
              this.showAlert("No se ha podido crear el directorio.");
            });
        }
        else{
          this.obtainFileList();
        }
      })
      .catch(e => {
        this.showAlert("No se ha podido comprobar si existe el directorio.");
      });
  }

}
