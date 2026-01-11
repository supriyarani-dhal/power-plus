import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sensor-management',
  imports: [RouterLink, FormsModule],
  templateUrl: './sensor-management.html',
  styleUrl: './sensor-management.scss',
})
export class SensorManagement {
  userEmail: string = '';
  showFilters = false;

  // Filters
  selectedRegion = '';
  selectedPlace = '';
  selectedDevice = '';
  selectedStatus = '';
  selectedType = '';
  searchText = '';

  sensorManagementData = [
    {
      region: 'Northern Region',
      place: 'Delhi',
      device: 'Substation CH-01',
      id: 'SEN-CH-001',
      name: 'Temperature Sensor',
      type: 'temperature',
      unit: '°C',
      status: 'active',
      lastValue: 72.4,
      enabled: true,
    },
    {
      region: 'Northern Region',
      place: 'Delhi',
      device: 'Substation CH-01',
      id: 'SEN-CH-002',
      name: 'Voltage Sensor',
      type: 'voltage',
      unit: 'V',
      status: 'active',
      lastValue: 231,
      enabled: true,
    },
    {
      region: 'Northern Region',
      place: 'Chandigarh',
      device: 'Feeder DL-02',
      id: 'SEN-DL-004',
      name: 'Current Sensor',
      type: 'current',
      unit: 'A',
      status: 'inactive',
      lastValue: 0,
      enabled: false,
    },
    {
      region: 'Southern Region',
      place: 'Chennai',
      device: 'Wind TN-01',
      id: 'SEN-TN-009',
      name: 'Wind Speed Sensor',
      type: 'wind',
      unit: 'km/h',
      status: 'active',
      lastValue: 38,
      enabled: true,
    },
  ];

  constructor() {
    const token = localStorage.getItem('token');
    this.userEmail = token ? 'admin@iot.com' : 'Unknown'; //TODO: Replace later with decoded JWT
  }

  get filteredData() {
    return this.sensorManagementData.filter(
      (d) =>
        (!this.selectedRegion || d.region === this.selectedRegion) &&
        (!this.selectedPlace || d.place === this.selectedPlace) &&
        (!this.selectedDevice || d.device === this.selectedDevice) &&
        (!this.selectedStatus || d.status === this.selectedStatus) &&
        (!this.selectedType || d.type === this.selectedType) &&
        (!this.searchText || d.name.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  toggleSensor(sensor: any) {
    sensor.enabled = !sensor.enabled;
    sensor.status = sensor.enabled ? 'active' : 'inactive';
  }
}
