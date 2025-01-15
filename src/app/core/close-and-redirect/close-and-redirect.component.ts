import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-close-and-redirect',
  imports: [MatIconButton, MatIcon, RouterLink],
  templateUrl: './close-and-redirect.component.html',
  styleUrl: './close-and-redirect.component.scss',
})
export class CloseAndRedirectComponent {}
