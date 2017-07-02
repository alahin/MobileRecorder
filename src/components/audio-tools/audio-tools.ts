import { Component, Input } from '@angular/core';
import { MediaObject } from '@ionic-native/media';
import { Platform } from 'ionic-angular';

@Component({
    selector: 'audio-tools',
    templateUrl: 'audio-tools.html'
})
export class AudioToolsComponent {
    @Input()
	audioMedia : MediaObject;//Utilizada para el play, pause y stop
	
	private isPlaying: boolean = false;
	public audioTime: number = 0;
	private timeCurrentPosition: any;
	public actualTime: string;
	public maxTime: any;
	public minTimeRange: number;
	public maxTimeRange: number;
	private initialTime: number;
	private isPaused: boolean = false;

    constructor(private platform: Platform) {
		this.actualTime = new Date(0).toISOString();
		this.platform.ready().then(() => {
			this.getDuration();
			this.initAudioTime();
        });
    }

	public play(){
		this.initAudioTime();
	}

	public pause(){
		this.pauseAudioTime();
	}

	public stop(){
		this.stopAudioTime();
	}

	/**
	 * Inicia el proceso de la barra de tiempo
	 * y el segundero. Se ejecutará cada segundo
	 * que dure el archivo de audio.
	 * Cuando se da a stop se inicializa todo,
	 * al igual que cuando termina el tiempo
	 * del audio.
	 */
	private initAudioTime(){
		if(!this.isPlaying){
			this.isPlaying = true;
			this.audioMedia.play();
			//Obtiene la fecha inicial
			this.initialTime = new Date().getTime();

			if(this.isPaused){
				this.isPaused = false;
			}

			this.timeCurrentPosition = setInterval(() => {
				this.audioMedia.getCurrentPosition()
					.then(time => {
						if(time <= 0){
							//Para el intervalo
							clearInterval(this.timeCurrentPosition);
							this.stopAudioTime();
						}
						else{
							//ngModel de la barra de tiempo
							this.audioTime = Math.round(time);
							if(!this.isPaused){
								//Obtiene la fecha actual transcurrido 1 segundo
								let actualTime = new Date().getTime();
								//Obtiene la diferencia entre el inicial y el actual y este será el tiempo a mostrar
								this.actualTime = new Date(actualTime - this.initialTime).toISOString();
							}
							else{
								this.actualTime = new Date(this.actualTime + 1).toISOString();
							}
						}
					});
			}, 1000);
		}
	}

	private pauseAudioTime(){
		this.isPaused = true;
		this.audioMedia.pause();
		clearInterval(this.timeCurrentPosition);
		this.isPlaying = false;
	}

	private stopAudioTime(){
		this.audioMedia.stop();
		this.isPlaying = false;
		this.audioTime = 0;
		this.actualTime = new Date(0).toISOString();
	}

	/**
	 * Obtiene los tiempos totales e iniciales
	 * en segundos del archivo de audio.
	 * Ha sido necesario meterlo dentro de un inteval
	 * que solo se ejectará una vez.
	 */
	private getDuration(){
		this.minTimeRange = 0;
		let time = setInterval(() => {
			this.maxTime = new Date(Math.round(this.audioMedia.getDuration())).toISOString();
			this.maxTimeRange = Math.round(this.audioMedia.getDuration());
			clearInterval(time);
		}, 100);
	}

}