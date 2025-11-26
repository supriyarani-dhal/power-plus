import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as d3 from 'd3';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  ngAfterViewInit() {
    const svg = d3.select('#chart').append('svg').attr('width', 500).attr('height', 300);

    // Example dummy chart
    svg.append('circle').attr('cx', 100).attr('cy', 100).attr('r', 40).attr('fill', 'steelblue');
  }

  userEmail: string = '';
  activeSensors = 43;
  regionCount = 12;
  alertCount = 5;

  constructor(private router: Router) {
    const token = localStorage.getItem('token');
    this.userEmail = token ? 'admin@iot.com' : 'Unknown';  //TODO: Replace later with decoded JWT
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
