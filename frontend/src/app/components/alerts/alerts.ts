import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-alerts',
  imports: [FormsModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss'
})

export class Alerts {
  userEmail: string = '';
  // Filters
  selectedSeverity = '';
  selectedRegion = '';
  searchText = '';

  // Dummy Alerts Data
  alertsData = [
    {
      id: 1,
      level: 'critical',
      message: 'Transformer overload detected',
      region: 'Northern Region',
      place: 'Delhi',
      device: 'Transformer DL-01',
      time: '2 min ago'
    },
    {
      id: 2,
      level: 'warning',
      message: 'High temperature detected',
      region: 'Northern Region',
      place: 'Chandigarh',
      device: 'Substation CH-01',
      time: '8 min ago'
    },
    {
      id: 3,
      level: 'info',
      message: 'New sensor added',
      region: 'Southern Region',
      place: 'Tamil Nadu',
      device: 'Wind TN-01',
      time: '20 min ago'
    },
    {
      id: 4,
      level: 'critical',
      message: 'Power outage detected',
      region: 'North Eastern Region',
      place: 'Tripura',
      device: 'TR Grid-01',
      time: '5 min ago'
    }
  ];

  constructor() {
    const token = localStorage.getItem('token');
    this.userEmail = token ? 'admin@iot.com' : 'Unknown'; //TODO: Replace later with decoded JWT
  }

  // Filtered Alerts
  get filteredAlerts() {
    return this.alertsData.filter(a =>
      (!this.selectedSeverity || a.level === this.selectedSeverity) &&
      (!this.selectedRegion || a.region === this.selectedRegion) &&
      (!this.searchText ||
        a.message.toLowerCase().includes(this.searchText.toLowerCase()) ||
        a.device.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }
}
