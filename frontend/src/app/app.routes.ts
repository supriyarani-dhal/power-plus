import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { RegionOverview } from './components/region-overview/region-overview';
import { SensorDetails } from './components/sensor-details/sensor-details';
import { Alerts } from './components/alerts/alerts';
import { SensorManagement } from './components/sensor-management/sensor-management';
import { loginGuard } from './guards/login-guard';
import { authGuard } from './guards/auth-guard';
import { Layout } from './components/layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  {
    path: '',
    component: Layout,     // <--- makes the sidebar persistent
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'regions', component: RegionOverview },
      { path: 'region/:id', component: SensorDetails },
      { path: 'alerts', component: Alerts },
      { path: 'sensors', component: SensorManagement },
    ]
  },
  { path: '**', redirectTo: '/login' }
];
