import { Component, Input } from '@angular/core';
import { MediaObject } from '@ionic-native/media';
import { Platform } from 'ionic-angular';

@Component({
    selector: 'audio-tools',
    templateUrl: 'audio-tools.html'
})
export class AudioToolsComponent {
    @Input() audioMedia: MediaObject;//Utilizada para el play, pause y stop
	@Input() maxTime: any;
	@Input() minTimeRange: number;
	@Input() maxTimeRange: number;

	private isPlaying: boolean = false;
	public audioTime: number = 0;
	private timeCurrentPosition: any;
	public actualTime: string;
	private initialTime: number;

    constructor(private platform: Platform) {
		this.actualTime = new Date(0).toISOString();
		this.getDuration();
    }

	public play(){
		this.initAudioTime();
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
							//Obtiene la fecha actual transcurrido 1 segundo
							let actualTime = new Date().getTime();
							//Obtiene la diferencia entre el inicial y el actual y este será el tiempo a mostrar
							this.actualTime = new Date(actualTime - this.initialTime).toISOString();
						}
					});
			}, 1000);
		}
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
			let duration = Math.round(this.audioMedia.getDuration());
			this.maxTime = new Date(duration).toISOString();
			this.maxTimeRange = Math.round(duration);
			clearInterval(time);
		}, 3000);
	}

}