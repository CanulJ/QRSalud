import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-toast.html',
  styleUrls: ['./welcome-toast.css'], // 👈 era styleUrls (plural)
})
export class WelcomeToast {
  @Input() nombre: string = '';
  visible: boolean = false;

  mostrar(nombre: string) {
    this.nombre = nombre;
    this.visible = true;
    setTimeout(() => (this.visible = false), 5000);
  }
}
