import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { LoginComponent } from './login/login.component';
// import { DataComponent } from './data/data.component';
import { UserComponent } from './demo/chart/user/user.component';
import { IncidentComponent } from './demo/chart/incident/incident.component';
import { RevertIncidentComponent } from './demo/chart/revert-incident/revert-incident.component';
// import { ViewUserComponent } from './demo/chart/view-user/view-user.component';
// import { ViewIncidentComponent } from './demo/chart/view-incident/view-incident.component';
// import { ClientComponent } from './demo/chart/client/client.component';
import { RiskDepartmentComponent } from './demo/chart/risk-department/risk-department.component';

import { ReportComponent } from './demo/chart/report/report.component';
import { TrackComponent } from './demo/chart/track/track.component';

import { AuthGuard } from './demo/pages/authentication/AuthGuard';

const routes: Routes = [

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
    path: 'admin',
    component: AdminComponent,
    // canActivate: [AuthGuard],
    children: [
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full',
      // },
      // {
      //   path: 'dashboard',
      //   loadComponent: () => import('./demo/dashboard/dashboard.component'),
      // },
      
     
      {
        path: 'basic',
        loadChildren: () =>
          import('./demo/ui-elements/ui-basic/ui-basic.module').then(
            (m) => m.UiBasicModule,
          ),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./demo/pages/form-elements/form-elements.module').then(
            (m) => m.FormElementsModule,
          ),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./demo/pages/tables/tables.module').then(
            (m) => m.TablesModule,
          ),
      },
      // {
      //   path: 'apexchart',
         
      //   loadComponent: () =>
      //     import('./demo/chart/apex-chart/apex-chart.component'),
      // },
      {
        path: 'incident',
        component: IncidentComponent,
        // canActivate: [AuthGuard],
       
      },
      {
        path: 'revert-incident',
        component: RevertIncidentComponent,
        canActivate: [AuthGuard],
       
      },
      {
        path: 'track',
        component: TrackComponent,
        canActivate: [AuthGuard],
       
      },
      // {
      //   path: 'view-user',
      //   component: ViewUserComponent,
       
      // },
      // {
      //   path: 'view-incident',
      //   component: ViewIncidentComponent,
       
      // },
      {
        path: 'risk-department',
        component: RiskDepartmentComponent,
        canActivate: [AuthGuard],
       
      },
      {
        path: 'report',
        component: ReportComponent,
        canActivate: [AuthGuard],
       
      },
    
  
      {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthGuard],
       
      },
      // {
      //   path: 'data',
      //   component: DataComponent,
      //   // loadComponent: () =>
      //   //   import('./demo/chart/apex-chart/apex-chart.component'),
      // },

      {
        path: 'sample-page',
        loadComponent: () =>
          import('./demo/extra/sample-page/sample-page.component'),
      },
    ],
  },
 
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./demo/pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
