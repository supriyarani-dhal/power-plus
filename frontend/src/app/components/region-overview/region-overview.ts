import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-region-overview',
  imports: [RouterLink, FormsModule, UpperCasePipe],
  templateUrl: './region-overview.html',
  styleUrl: './region-overview.scss'
})
export class RegionOverview {
  userEmail: string = '';
  router = new Router();

  regions = [
    { code: 'NR', name: 'Northern Region' },
    { code: 'ER', name: 'Eastern Region' },
    { code: 'WR', name: 'Western Region' },
    { code: 'NER', name: 'North Eastern Region' },
    { code: 'SR', name: 'Southern Region' }
  ];

  selectedRegionCode = 'NR';
  selectedPlaceName = 'Chandigarh';
  selectedRegion: any;
  selectedPlace: any;

  devices: any[] = [];
  alerts: any[] = [];

  regionHealth: 'good' | 'warning' | 'critical' = 'good';

  healthyPercent = 0;
  flappingPercent = 0;
  offlinePercent = 0;

  loadRisks: any[] = [];
  dataIssues: any[] = [];

  regionData = [
  // =======================
  // NORTHERN REGION (NR)
  // =======================
  {
    code: 'NR',
    name: 'Northern Region',
    places: [
      {
        name: 'Chandigarh',
        gridType: 'central',
        summary: { devices: 6, sensors: 28, activeSensors: 25, offlineSensors: 3, alerts: 1 },
        devices: [
          { name: 'Substation CH-01', status: 'online', type: 'Substation', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 15 },
          { name: 'Feeder CH-02', status: 'online', type: 'Feeder', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 10 }
        ],
        alerts: [{ type: 'warning', message: 'Voltage fluctuation detected', time: '12 min ago' }]
      },
      {
        name: 'Delhi',
        gridType: 'central',
        summary: { devices: 14, sensors: 62, activeSensors: 55, offlineSensors: 7, alerts: 3 },
        devices: [
          { name: 'Transformer DL-01', status: 'online', type: 'Transformer', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 20 },
          { name: 'Feeder DL-02', status: 'offline', type: 'Feeder', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 15 }
        ],
        alerts: [
          { type: 'critical', message: 'Overload warning on main feeder', time: '1 min ago' },
          { type: 'warning', message: 'High temperature detected', time: '5 min ago' },
          { type: 'info', message: 'New sensor added', time: '20 min ago' }
        ]
      },
      {
        name: 'Haryana',
        gridType: 'central',
        summary: { devices: 10, sensors: 45, activeSensors: 40, offlineSensors: 5, alerts: 2 },
        devices: [{ name: 'Grid HR-01', status: 'online', type: 'Grid', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'warning', message: 'Load nearing peak limit', time: '15 min ago' }]
      },
      {
        name: 'Himachal Pradesh',
        gridType: 'central',
        summary: { devices: 7, sensors: 32, activeSensors: 30, offlineSensors: 2, alerts: 1 },
        devices: [{ name: 'Hydro HP-01', status: 'online', type: 'Hydro', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'info', message: 'Hydro output stable', time: '25 min ago' }]
      },
      {
        name: 'Jammu & Kashmir',
        gridType: 'central',
        summary: { devices: 5, sensors: 22, activeSensors: 20, offlineSensors: 2, alerts: 1 },
        devices: [{ name: 'Hydro JK-01', status: 'offline', type: 'Hydro', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'critical', message: 'Transmission fault detected', time: '8 min ago' }]
      },
      {
        name: 'Ladakh',
        gridType: 'standalone',
        summary: { devices: 2, sensors: 8, activeSensors: 8, offlineSensors: 0, alerts: 0 },
        devices: [{ name: 'Solar LD-01', status: 'online', type: 'Solar', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 8 }],
        alerts: []
      },
      {
        name: 'Punjab',
        gridType: 'central',
        summary: { devices: 8, sensors: 36, activeSensors: 33, offlineSensors: 3, alerts: 1 },
        devices: [{ name: 'Agri Grid PB-01', status: 'online', type: 'Agri Grid', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'warning', message: 'High agricultural demand', time: '18 min ago' }]
      },
      {
        name: 'Rajasthan',
        gridType: 'central',
        summary: { devices: 9, sensors: 40, activeSensors: 38, offlineSensors: 2, alerts: 1 },
        devices: [{ name: 'Solar RJ-01', status: 'online', type: 'Solar', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'info', message: 'Solar output high', time: '30 min ago' }]
      },
      {
        name: 'Uttar Pradesh',
        gridType: 'central',
        summary: { devices: 16, sensors: 70, activeSensors: 60, offlineSensors: 10, alerts: 2 },
        devices: [{ name: 'UP Main Grid', status: 'online', type: 'Main Grid', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 25 }],
        alerts: [{ type: 'critical', message: 'Peak demand stress', time: '4 min ago' }]
      },
      {
        name: 'Uttarakhand',
        gridType: 'central',
        summary: { devices: 6, sensors: 25, activeSensors: 23, offlineSensors: 2, alerts: 1 },
        devices: [{ name: 'Hydro UK-01', status: 'online', type: 'Hydro', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'info', message: 'River flow stable', time: '40 min ago' }]
      }
    ]
  },

  // =======================
  // EASTERN REGION (ER)
  // =======================
  {
    code: 'ER',
    name: 'Eastern Region',
    places: [
      {
        name: 'Bihar',
        gridType: 'central',
        summary: { devices: 8, sensors: 35, activeSensors: 30, offlineSensors: 5, alerts: 2 },
        devices: [{ name: 'Grid BR-01', status: 'offline', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 15 }],
        alerts: [{ type: 'warning', message: 'Transformer overheating', time: '10 min ago' }]
      },
      {
        name: 'Jharkhand',
        gridType: 'central',
        summary: { devices: 6, sensors: 28, activeSensors: 26, offlineSensors: 2, alerts: 1 },
        devices: [{ name: 'Coal JH-01', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'info', message: 'Coal supply stable', time: '35 min ago' }]
      },
      {
        name: 'Odisha',
        gridType: 'central',
        summary: { devices: 9, sensors: 38, activeSensors: 34, offlineSensors: 4, alerts: 1 },
        devices: [{ name: 'Industrial OD-01', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'warning', message: 'Industrial load high', time: '22 min ago' }]
      },
      {
        name: 'Sikkim',
        gridType: 'central',
        summary: { devices: 4, sensors: 18, activeSensors: 18, offlineSensors: 0, alerts: 0 },
        devices: [{ name: 'Hydro SK-01', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: []
      },
      {
        name: 'West Bengal',
        gridType: 'central',
        summary: { devices: 12, sensors: 55, activeSensors: 48, offlineSensors: 7, alerts: 2 },
        devices: [{ name: 'WB Metro Grid', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'critical', message: 'Substation overload', time: '6 min ago' }]
      },
      {
        name: 'Andaman & Nicobar',
        gridType: 'standalone',
        summary: { devices: 3, sensors: 12, activeSensors: 11, offlineSensors: 1, alerts: 1 },
        devices: [{ name: 'Diesel AN-01', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'warning', message: 'Fuel level low', time: '14 min ago' }]
      }
    ]
  },

  // =======================
  // WESTERN REGION (WR)
  // =======================
  {
    code: 'WR',
    name: 'Western Region',
    places: [
      {
        name: 'Gujarat',
        gridType: 'central',
        summary: { devices: 15, sensors: 68, activeSensors: 65, offlineSensors: 3, alerts: 1 },
        devices: [{ name: 'Industrial GJ-01', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'info', message: 'Grid operating optimally', time: '45 min ago' }]
      },
      {
        name: 'Maharashtra',
        gridType: 'central',
        summary: { devices: 18, sensors: 80, activeSensors: 72, offlineSensors: 8, alerts: 3 },
        devices: [{ name: 'Mumbai Grid', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'critical', message: 'Urban peak demand', time: '3 min ago' }]
      },
      {
        name: 'Goa',
        gridType: 'central',
        summary: { devices: 4, sensors: 16, activeSensors: 15, offlineSensors: 1, alerts: 0 },
        devices: [{ name: 'Goa Coastal Grid', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: []
      }
    ]
  },

  // =======================
  // SOUTHERN REGION (SR)
  // =======================
  {
    code: 'SR',
    name: 'Southern Region',
    places: [
      {
        name: 'Tamil Nadu',
        gridType: 'central',
        summary: { devices: 17, sensors: 75, activeSensors: 70, offlineSensors: 5, alerts: 2 },
        devices: [{ name: 'Wind TN-01', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'warning', message: 'Wind speed fluctuation', time: '9 min ago' }]
      },
      {
        name: 'Karnataka',
        gridType: 'central',
        summary: { devices: 12, sensors: 50, activeSensors: 46, offlineSensors: 4, alerts: 1 },
        devices: [{ name: 'Solar KA-01', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'info', message: 'Solar output stable', time: '28 min ago' }]
      },
      {
        name: 'Lakshadweep',
        gridType: 'standalone',
        summary: { devices: 2, sensors: 6, activeSensors: 6, offlineSensors: 0, alerts: 0 },
        devices: [{ name: 'Diesel LK-01', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: []
      }
    ]
  },

  // =======================
  // NORTH EASTERN REGION (NER)
  // =======================
  {
    code: 'NER',
    name: 'North Eastern Region',
    places: [
      {
        name: 'Assam',
        gridType: 'central',
        summary: { devices: 7, sensors: 30, activeSensors: 27, offlineSensors: 3, alerts: 1 },
        devices: [{ name: 'NER Hub AS-01', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'warning', message: 'Transmission congestion', time: '17 min ago' }]
      },
      {
        name: 'Arunachal Pradesh',
        gridType: 'central',
        summary: { devices: 5, sensors: 20, activeSensors: 20, offlineSensors: 0, alerts: 0 },
        devices: [{ name: 'Hydro AR-01', status: 'online', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: []
      },
      {
        name: 'Tripura',
        gridType: 'central',
        summary: { devices: 4, sensors: 18, activeSensors: 16, offlineSensors: 2, alerts: 1 },
        devices: [{ name: 'TR Grid-01', status: 'offline', updatedAt: '2024-06-10T10:15:00Z', sensorCount: 12 }],
        alerts: [{ type: 'critical', message: 'Power outage detected', time: '11 min ago' }]
      }
    ]
  }
];

  constructor() {
    const token = localStorage.getItem('token');
    this.userEmail = token ? 'admin@iot.com' : 'Unknown'; //TODO: Replace later with decoded JWT

    this.loadRegion();
  }

  onRegionChange() {
    this.loadRegion();
  }

  loadRegion() {
    this.selectedRegion = this.regionData.find(
      r => r.code === this.selectedRegionCode
    )

    this.calculateRegionHealth();
    this.calculateSensorReliability();
    this.buildLoadRisks();
    this.buildDataIssues();
  }

  /** ===============================
   *  REGION HEALTH LOGIC
   *  =============================== */
  calculateRegionHealth() {
    let criticalAlerts = 0;
    let offlineSensors = 0;

    this.selectedRegion.places.forEach((p: any) => {
      criticalAlerts += p.alerts.filter((a: any) => a.type === 'critical').length;
      offlineSensors += p.summary.offlineSensors;

      // Attach health to place (used by UI)
      p.health =
        p.summary.offlineSensors > 5 || p.alerts.some((a: any) => a.type === 'critical')
          ? 'critical'
          : p.alerts.length > 0
          ? 'warning'
          : 'good';

      p.totalSensors = p.summary.sensors;
      p.activeSensors = p.summary.activeSensors;
      p.offlineSensors = p.summary.offlineSensors;
      p.alertCount = p.alerts.length;
    });

    this.regionHealth =
      criticalAlerts > 3 || offlineSensors > 15
        ? 'critical'
        : criticalAlerts > 0
        ? 'warning'
        : 'good';
  }

  /** ===============================
   *  SENSOR RELIABILITY
   *  =============================== */
  calculateSensorReliability() {
    let total = 0;
    let active = 0;
    let offline = 0;

    this.selectedRegion.places.forEach((p: any) => {
      total += p.summary.sensors;
      active += p.summary.activeSensors;
      offline += p.summary.offlineSensors;
    });

    this.healthyPercent = Math.round((active / total) * 100);
    this.offlinePercent = Math.round((offline / total) * 100);
    this.flappingPercent = 100 - this.healthyPercent - this.offlinePercent;
  }

  /** ===============================
   *  LOAD RISK FORECAST
   *  =============================== */
  buildLoadRisks() {
    this.loadRisks = this.selectedRegion.places.map((p: any) => ({
      place: p.name,
      risk:
        p.summary.alerts > 2
          ? 'high'
          : p.summary.alerts > 0
          ? 'medium'
          : 'low'
    }));
  }

  /** ===============================
   *  DATA QUALITY / GRID ISSUES
   *  =============================== */
  buildDataIssues() {
    this.dataIssues = [];

    this.selectedRegion.places.forEach((p: any) => {
      p.alerts.forEach((a: any) => {
        this.dataIssues.push({
          place: p.name,
          message: a.message,
          time: a.time
        });
      });
    });
  }

  /** ===============================
   *  NAVIGATION
   *  =============================== */
  navigateToSensors(place: any) {
    this.router.navigate(['/sensors'], {
      queryParams: {
        region: this.selectedRegion.name,
        place: place.name
      }
    });
  }
}
