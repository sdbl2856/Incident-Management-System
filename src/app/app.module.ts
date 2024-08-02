import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './theme/shared/shared.module';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavLogoComponent } from './theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { ToggleFullScreenDirective } from './theme/shared/components/full-screen/toggle-full-screen';
import { LoginComponent } from './login/login.component';
// import { DataComponent } from './data/data.component';
import { UserComponent } from './demo/chart/user/user.component';
// import { ViewUserComponent } from './demo/chart/view-user/view-user.component';
// import { ClientComponent } from './demo/chart/client/client.component';
import { IncidentComponent } from './demo/chart/incident/incident.component';
import { FormElementsModule } from './demo/pages/form-elements/form-elements.module';
import BasicElementsComponent from './demo/pages/form-elements/basic-elements/basic-elements.component';
import { RevertIncidentComponent } from './demo/chart/revert-incident/revert-incident.component';
// import { ViewIncidentComponent } from './demo/chart/view-incident/view-incident.component';
import { DatePipe } from '@angular/common';
import { RiskDepartmentComponent } from './demo/chart/risk-department/risk-department.component';

import { ToastrModule } from 'ngx-toastr';
import { ReportComponent } from './demo/chart/report/report.component';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TrackComponent } from './demo/chart/track/track.component';





@NgModule({
  declarations: [
    AppComponent,
    GuestComponent,
    AdminComponent,
    ConfigurationComponent,
    NavBarComponent,
    NavigationComponent,
    NavLeftComponent,
    NavRightComponent,
    NavContentComponent,
    NavLogoComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent,
    NavSearchComponent,
    ToggleFullScreenDirective,
    LoginComponent,
    // DataComponent,
    // ViewUserComponent,
   
    IncidentComponent,
    RevertIncidentComponent,
    // ViewIncidentComponent,
    UserComponent,
    RiskDepartmentComponent,
   
    ReportComponent,
    TrackComponent
    
    
     
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormElementsModule,
    // MatInputModule,
    // MatFormFieldModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatIconModule,
    MatSnackBarModule,
    
    ToastrModule.forRoot(), // ToastrModule added
  
    
    
   
     
    
   
  ],
  providers: [NavigationItem,DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
