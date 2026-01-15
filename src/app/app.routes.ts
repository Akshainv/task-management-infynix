import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { AdminManagersComponent } from './admin-managers/admin-managers';
import { AdminEmployeeComponent } from './admin-employee/admin-employee';
import { AdminServiceRequestsComponent } from './admin-service-requests/admin-service-requests';
import { AdminProjectOverviewComponent } from './admin-project-overview/admin-project-overview';
import { EmployeeSidebarComponent } from './employee-sidebar/employee-sidebar';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard';
import { EmployeeMyTasksComponent } from './employee-my-tasks/employee-my-tasks';
import { EmployeeCompletedProjectsComponent } from './employee-completed-projects/employee-completed-projects';
import { EmployeeNotificationsComponent } from './employee-notifications/employee-notifications';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'admin/managers',
    component: AdminManagersComponent
  },
  {
    path: 'admin/employees',
    component: AdminEmployeeComponent
  },
  {
    path: 'admin/project-overview',
    component: AdminProjectOverviewComponent
  },
  {
    path: 'admin/notifications',
    component: AdminServiceRequestsComponent
  },
  {
    path: 'employee/dashboard',
    component: EmployeeDashboardComponent
  },
  {
    path: 'employee/tasks/my',
    component: EmployeeMyTasksComponent
  },
  {
    path: 'employee/projects/completed',
    component: EmployeeCompletedProjectsComponent
  },
  {
    path: 'employee/notifications',
    component: EmployeeNotificationsComponent
  },
  {
    path: 'employee',
    component: EmployeeSidebarComponent
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];