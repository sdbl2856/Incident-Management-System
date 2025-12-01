import { Component } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../../../../login/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/demo/chart/user/user.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class NavRightComponent {
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId: boolean;
  name : any ;
  level:any;
   branchDes : any ;
   email:any;
   username:any;
  department:any;
  departmentDes:any;
  user_types:any[];
  description:any;

  constructor(config: NgbDropdownConfig,private router: Router, private authService: AuthService,private userService:UserService) {
    config.placement = 'bottom-right';
    this.visibleUserList = false;
    this.chatMessage = false;
  }

  onChatToggle(friend_id) {
    this.friendId = friend_id;
    this.chatMessage = !this.chatMessage;
  }

  logout() {
    // Call the logout method from your AuthService
    this.authService.logout();
  }

  ngOnInit() {

    this.name = this.authService.getName();
    this.level=this.authService.getLevel();
    this.email=this.authService.getEmail();

    this.username = this.email.split('@')[0];
    this.branchDes=this.authService.getBranchDes();
    this.departmentDes = this.authService.getDepartmentDes();
    console.log("branch : "+this.branchDes);
    console.log("department : "+this.departmentDes);
    this.getBranches();


  }



 getBranches() {
  this.userService.getBranches().subscribe((data: any) => {
    this.user_types = data.usertypeList;             
    console.log(this.user_types);

    // Find the user type with the same level as the type
    const userType = this.user_types.find((user) => user.type === this.level);

    if (userType) {
      // If a match is found, set the description
      if (userType.type === 'NU') {
        // If type is 'NU' (Created User), set description to 'Normal User'
        this.description = 'Normal(AD) User';
      } else {
        // Otherwise, use the description from the userType object
        this.description = userType.description;
      }
    } else {
      // Handle case when no match is found
      this.description = 'Normal User';
    }
  });
}



}
