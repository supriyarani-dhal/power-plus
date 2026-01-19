import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-device',
  imports: [FormsModule, RouterLink],
  templateUrl: './manage-device.html',
  styleUrl: './manage-device.scss',
})
export class ManageDevice {

  userEmail: string = '';
  showFilters = false;

  // Filters
  selectedRegion = '';
  selectedPlace = '';
  selectedDeviceType = '';
  selectedStatus = '';
  searchText = '';

  deviceManagementData = [
    {
      id: 'DEV-CH-001',
      name: 'Substation CH-01',
      type: 'substation',
      location: 'Delhi',
      region: 'Northern Region',
      status: 'active',
      enabled: true,
    },
    {
      id: 'DEV-CH-002',
      name: 'Feeder DL-02',
      type: 'feeder',
      location: 'Chandigarh',
      region: 'Northern Region',
      status: 'inactive',
      enabled: false,
    },
    {
      id: 'DEV-TN-001',
      name: 'Wind TN-01',
      type: 'wind',
      location: 'Chennai',
      region: 'Southern Region',
      status: 'active',
      enabled: true,
    },
    {
      id: 'DEV-KL-003',
      name: 'Transformer KL-03',
      type: 'transformer',
      location: 'Kochi',
      region: 'Southern Region',
      status: 'inactive',
      enabled: false,
    },
  ];

  constructor() {
    const token = localStorage.getItem('token');
    this.userEmail = token ? 'admin@iot.com' : 'Unknown'; // TODO: Replace with decoded JWT if needed
  }

  get filteredData() {
    return this.deviceManagementData.filter(
      (d) =>
        (!this.selectedRegion || d.region === this.selectedRegion) &&
        (!this.selectedPlace || d.location === this.selectedPlace) &&
        (!this.selectedDeviceType || d.type === this.selectedDeviceType) &&
        (!this.selectedStatus || d.status === this.selectedStatus) &&
        (!this.searchText || d.name.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  toggleDevice(device: any) {
    device.enabled = !device.enabled;
    device.status = device.enabled ? 'active' : 'inactive';
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}

