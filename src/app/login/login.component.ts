import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  level:string = '';
  formValue: FormGroup;
  loginMessage: string = '';
  loginMessageClass: string = '';
  incidentCount:number=0;
  btn_tag=true;
  log_div=false;
  loading = true;
  staff_type: string = '';
  // constructor(private router: Router, private authService: AuthService) {}

  constructor(private formBuilder: FormBuilder,private router: Router, private authService: AuthService) {
    this.formValue = this.formBuilder.group({
      level: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }



onSubmit() {
  this.loading = false;
 
  const credentials = {
    username: this.formValue.get('username').value,
    password: this.formValue.get('password').value,
   
  };

  console.log(credentials);
  this.authService.login(credentials).subscribe(
    
    (response: any) => {

      if (response.code == 200) {
        this.loginMessage = response.message;
        this.loginMessageClass = 'login-message';
        console.log("response : "+response.user.incidentCount);
        console.log("type : "+ response.user.userType);
        this.username = '';
        this.password = '';
        // this.loading = t;
        // Handle the token in AuthService and possibly store it securely
        this.authService.setId(response.user.userId);
        this.authService.setLevel(response.user.userT.type);
        this.authService.setName(response.user.fullName);
        this.authService.setBranch(response.user.branch);
        this.incidentCount = this.authService.getIncidentCount();
        this.authService.setIncidentCount(response.user.incidentCount);
        this.authService.setToken(response.token);



        

        if(response.user.userT.type=="RC"){
          this.router.navigate(['/admin/incident']);

        }else if(response.user.userT.type=="BM"){
          this.router.navigate(['/admin/incident']);

        }else if(response.user.userT.type=="RM"){
          this.router.navigate(['/admin/incident']);
        }
        else if(response.user.userT.type=="RO"){
          this.router.navigate(['/admin/risk-department']);

        }else if(response.user.userT.type=="ORM"){
          this.router.navigate(['/admin/risk-department']);

        } 
        else if(response.user.userT.type=="DRC"){
          this.router.navigate(['/admin/incident']);

        }else if(response.user.userT.type=="RRC"){
          this.router.navigate(['/admin/incident']);

        }else if(response.user.userT.type=="AD"){
          this.router.navigate(['/admin/user']);

        }

      } else  if (response.code == 201){
        this.loginMessage = response.message;

      
        this.router.navigate(['/admin/incident']);

        
      }else{
        this.loading = true;
        console.log("####");
        console.log(response);
        this.loginMessage = response.message;
        this.loginMessageClass = 'login-message-failed';
      }
      
    },
    (error: any) => {
      this.loading = true;
      this.loginMessage = 'An error occurred during login. Please try again later.';
      this.loginMessageClass = 'login-message-failed';
      console.error('Authentication error:', error);
    }
  );
}

  logout() {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }

}














// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from './auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
// })
// export class LoginComponent {
//   username: string = '';
//   password: string = '';
//   loginMessage: string = '';
//   loginMessageClass: string = '';

//   constructor(private router: Router, private authService: AuthService) {}

//   onSubmit() {
    
//     this.router.navigate(['/admin']);
//     // const credentials = {
//     //   username: this.username,
//     //   password: this.password,
//     // };

//     // Call the login method of  AuthService, which sends a request to the API
//     // this.authService.login(credentials).subscribe(
//     //   (response: any) => {
//     //     if (response.token) {
//     //       this.loginMessage = 'Login successful';
//     //       this.loginMessageClass = 'login-message';

//     //       this.username = '';
//     //       this.password = '';

//     //       // Handle the token in AuthService and possibly store it securely
//     //       this.authService.setToken(response.token);

//     //       this.router.navigate(['/admin']);
//     //     } else {
//     //       this.loginMessage = 'Login failed. Please check your credentials.';
//     //       this.loginMessageClass = 'login-message-failed';
//     //     }
//     //   },
//     //   (error: any) => {
//     //     // Handle error (e.g., network issue, server error, etc.)
//     //     console.error('Authentication error:', error);
//     //   }
//     // );
//   }


//   logout() {
//     this.authService.logout(); // Call the logout method in AuthService
//     this.router.navigate(['/login']); // Navigate to the login page or other desired page
//   }

// }
