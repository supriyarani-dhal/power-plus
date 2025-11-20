import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { RegionOverview } from './components/region-overview/region-overview';
import { SensorDetails } from './components/sensor-details/sensor-details';
import { Alerts } from './components/alerts/alerts';
import { SensorManagement } from './components/sensor-management/sensor-management';
import { loginGuard } from './guards/login-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'regions', component: RegionOverview, canActivate: [authGuard] },
  { path: 'region/:id', component: SensorDetails, canActivate: [authGuard] },
  { path: 'alerts', component: Alerts, canActivate: [authGuard] },
  { path: 'sensors/manage', component: SensorManagement, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
