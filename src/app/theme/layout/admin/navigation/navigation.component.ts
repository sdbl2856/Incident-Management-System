import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DattaConfig } from 'src/app/app-config';
import { AuthService } from 'src/app/login/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent  {
  userType:any;

  @Output() onNavCollapse = new EventEmitter();
  @Output() onNavCollapsedMob = new EventEmitter();
  navCollapsed;
  navCollapsedMob;
  windowWidth: number;

  constructor(private authService: AuthService, private router: Router) {
    this.windowWidth = window.innerWidth;
    this.navCollapsed =
      this.windowWidth >= 992 ? DattaConfig.isCollapseMenu : false;
    this.navCollapsedMob = false;
  }

  ngOnInit() {
    this.userType = this.authService.getLevel(); 
    // console.log("type vslue from ts file :" + this.userType)
  }




  navCollapse() {
    if (this.windowWidth >= 992) {
      this.navCollapsed = !this.navCollapsed;
      this.onNavCollapse.emit();
    }
  }

  navCollapseMob() {
    if (this.windowWidth < 992) {
      this.onNavCollapsedMob.emit();
    }
  }







}
