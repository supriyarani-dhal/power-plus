import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sensor-details',
  imports: [RouterLink],
  templateUrl: './sensor-details.html',
  styleUrl: './sensor-details.scss'
})
export class SensorDetails {

  // ===== SENSOR METADATA =====
  sensor = {
    id: 'SEN-DEL-001',
    name: 'Temperature Sensor',
    deviceName: 'Transformer DL-01',
    region: 'Northern Region',
    place: 'Delhi',
    unit: '°C',
    status: 'online',
    installedOn: '2024-06-15',
    lastUpdated: '2 min ago'
  };

  // ===== LATEST VALUE (Redis simulation) =====
  latestReading = {
    value: 78.4,
    timestamp: '2 min ago'
  };

  // ===== HISTORICAL READINGS =====
  history = [
    { time: '10 min ago', value: 75.1 },
    { time: '20 min ago', value: 74.8 },
    { time: '30 min ago', value: 73.5 },
    { time: '40 min ago', value: 72.9 },
    { time: '50 min ago', value: 72.3 }
  ];

  // ===== ALERTS FOR THIS SENSOR =====
  alerts = [
    { type: 'critical', message: 'Temperature exceeded safe limit', time: '5 min ago' },
    { type: 'warning', message: 'Rapid temperature rise detected', time: '15 min ago' }
  ];

}
