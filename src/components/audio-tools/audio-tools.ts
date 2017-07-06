import { Component, Input } from '@angular/core';
import { MediaObject } from '@ionic-native/media';
import { Events } from 'ionic-angular';

@Component({
    selector: 'audio-tools',
    templateUrl: 'audio-tools.html'
})
export class AudioToolsComponent {
    @Input() audioMedia: MediaObject;//Utilizada para el play, pause y stop
	public maxTime: any;
	public minTimeRange: number;
	public maxTimeRange: number;
	private isPlaying: boolean = false;
	public audioTime: number = 0;
	private timeCurrentPosition: any;
	public actualTime: string;
	private initialTime: number;

    constructor(events: Events) {
		this.actualTime = new Date(0).toISOString();
		//Evento para parar el audio desde el componente padre
		events.subscribe('stopAudioTime', () => {
			this.stopAudioTime();
		});
    }

	public play(){
		this.initAudioTime();
		this.getDuration();
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

			//Time para la barra de tiempo(se ejecuta cada segundo)
			this.timeCurrentPosition = setInterval(() => {
				this.audioMedia.getCurrentPosition()
					.then(time => {
						if(time <= 0){
							//Para el intervalo y resetea el audio
							clearInterval(this.timeCurrentPosition);
							this.stopAudioTime();
						}
						else{
							//ngModel utilizado en la barra de tiempo
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
			console.log("duration:: ", duration);
			this.maxTime = new Date(duration*1000).toISOString();
			console.log("this.maxTime:: ", this.maxTime);
			this.maxTimeRange = duration;
			console.log("this.maxTimeRange:: ", this.maxTimeRange);
			clearInterval(time);
		}, 100);
	}
}