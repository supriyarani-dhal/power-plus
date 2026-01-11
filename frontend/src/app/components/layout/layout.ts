import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRightFromBracket,
  faBell,
  faBroadcastTower,
  faChartArea,
  faChartLine,
  faPlusCircle,
  faServer,
  faMicrochip,
  faSliders,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-layout',
  imports: [FontAwesomeModule, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  faChartLine = faChartLine;
  faChartArea = faChartArea;
  faBroadcastTower = faBroadcastTower;
  faBell = faBell;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faPlusCircle = faPlusCircle;
  faServer = faServer;
  faMicrochip = faMicrochip;
  faSliders = faSliders;

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
