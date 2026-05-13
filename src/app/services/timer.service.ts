import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private _segundos = signal(0);
  private timerInterval: any;

  public segundos = this._segundos.asReadonly();

  public tiempoFormateado = computed(() => {
    const totalSegundos = this._segundos();
    const mins = Math.floor(totalSegundos / 60).toString().padStart(2, '0');
    const secs = (totalSegundos % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  });

  iniciar(): void {
    if (!this.timerInterval) {
      this.timerInterval = setInterval(() => {
        this._segundos.update(s => s + 1);
      }, 1000);
    }
  }

  pausar(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  reiniciar(): void {
    this.pausar();
    this._segundos.set(0);
  }
}