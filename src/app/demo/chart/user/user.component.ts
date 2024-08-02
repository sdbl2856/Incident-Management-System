import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { FormBuilder } from '@angular/forms';
import { UserModel } from './user-model';
import { AuthService } from 'src/app/login/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  users: any;
  userlist:any;
  formValue: any;
  usermodel_obj: UserModel = new UserModel();
  showContent = true;
  showForm = false;
  update_btn = false;
  create_btn = true;
  branches: any[];
  departments: any[];
  regions: any[];
  user_types: any[];
  branches_region: any[];
  specificBranches = [];
  not_filled = false;
  regionsId: any[];
  logged_id: any;
  showSuccessMessage: boolean = false;
  successMessage: string = '';

  // New properties for pagination
  currentPage: number = 1;
  itemsPerPage: number = 6; 
  displayedUserList: any[] = [];

  // for search
  searchTerm: string = '';
  // New property for filtered user list
 filteredUserList: any[] = [];

 showRegionDropdown = false;
 showBranchDropdown = false;
 showDepartmentDropdown = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _snackBar: MatSnackBar
  )
   {
    this.formValue = this.formBuilder.group({
      userId: [''],  
      name: [''],
      emp_code: [''],
      grade: [''],
      designation: [''],
      email: [''],
      region: [''],
      branch: [''],
      status: [''],
      user_type: [''],
      dep: [''],
    });
  }

  ngOnInit() {
    this.getPosts();
    this.getBranches();
    // Initialize this.users as an empty array
    this.users = [];
    this.logged_id = this.authService.getId();
    // console.log(this.logged_id);
   
   
  
  }


  getPosts() {
    this.userService.getPosts().subscribe((data: any) => {
      this.userlist = data['userList'];
      this.updateDisplayedData(); 
      // this.applySearch();
    });
  }

  getBranches() {
    this.userService.getBranches().subscribe((data: any) => {
      console.log(data);
      this.branches = data.branchList;
      this.regions = data.regions;
      this.user_types = data.usertypeList;
      this.departments = data.departmentList;
      

    

      // console.log(this.branches);
      // console.log(this.regions);
      // console.log(this.user_types);
    });
  }
  onRegionChange(): void {
    this.specificBranches = [];
    const selectedRegionId = this.formValue.get('region')?.value;
  
    for (let i = 0; i < this.branches.length; i++) {
      if (this.branches[i].region.regionId == selectedRegionId) {
        this.specificBranches.push(this.branches[i]);
      }
    }
  
    // Set the default branch value if it's not already set
    const branchControl = this.formValue.get('branch');
    if (!branchControl.value && this.specificBranches.length > 0) {
      branchControl.setValue(this.specificBranches[0].branchId);
    }
  }
  
  
// Inside your component class
onUserTypeChange() {
  const userType = this.formValue.get('user_type').value;

  // Reset dropdowns
  this.showRegionDropdown = false;
  this.showBranchDropdown = false;
  this.showDepartmentDropdown = false;

  // Check the selected user type
  if (userType === 'RC' || userType === 'BM' || userType === 'AD') {
    // Enable and show both region and branch dropdowns
    this.showRegionDropdown = true;
    this.showBranchDropdown = true;

    // Enable region and branch controls
    this.formValue.get('region').enable();
    this.formValue.get('branch').enable();

    // Trigger the initial onRegionChange to populate the branch list
    this.onRegionChange();
  } else if (userType === 'RO' || userType === 'ORM') {
    // Enable and show region, branch, and department dropdowns
    this.showRegionDropdown = true;
    this.showBranchDropdown = true;
    // this.showDepartmentDropdown = true;

    // Set specific values for region and branch
    this.formValue.get('region').setValue(11);
    this.formValue.get('region').disable();
    this.onRegionChange();
    this.formValue.get('branch').setValue(999);
    this.formValue.get('branch').disable();
  } else if (userType === 'RM' || userType === 'RRC') {
    // Enable and show region dropdown, disable branch dropdown
    this.showRegionDropdown = true;
    this.showBranchDropdown = true;

    // Enable region control, disable branch control
    this.formValue.get('region').enable();
    this.formValue.get('branch').disable();

 
  }else if (userType === 'DRC') {
    this.showRegionDropdown = true;
    this.showBranchDropdown = true;
    this.showDepartmentDropdown = true;

    // Set specific values for region and branch
    this.formValue.get('region').setValue(11);
    this.formValue.get('region').disable();
    this.onRegionChange();
    this.formValue.get('branch').setValue(999);
    this.formValue.get('branch').disable();

 
  }


}



  onEdit(row: any) {

    this.specificBranches = this.branches;
    this.specificBranches = [];
    for (let i = 0; i < this.branches.length; i++) {
      if (this.branches[i].region.regionId == row.region.regionId) {
        this.specificBranches.push(this.branches[i]);
      }
    }
    console.log(row);
    // console.log('Department ID:', row.depId);
    this.showContent = false;
    this.showForm = true;
    this.update_btn = true;
    this.create_btn = false;
    this.formValue.controls['userId'].setValue(row.userId);
    this.formValue.controls['name'].setValue(row.fullName);
    this.formValue.controls['emp_code'].setValue(row.employeeCode);
    this.formValue.controls['grade'].setValue(row.grade);
    this.formValue.controls['designation'].setValue(row.designation);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['region'].setValue(row.region.regionId);
    this.formValue.controls['branch'].setValue(row.branch.branchId);
    this.formValue.controls['status'].setValue(row.status);
    this.formValue.controls['user_type'].setValue(row.userType);
    this.formValue.controls['dep'].setValue(row.depId);

  }

  postDetails() {
    console.log('inside post');
    const employeeCodePattern = /^sdbl\d+$/i;

    this.formValue.get('branch')?.enable();
    this.formValue.get('region')?.enable();
    this.formValue.get('dep')?.enable();



    const fullName = this.formValue.value.name;
    const employeeCode = this.formValue.value.emp_code;
    const grade = this.formValue.value.grade;
    const designation = this.formValue.value.designation;
    const email = this.formValue.value.email;
    const region = this.formValue.value.region;
    const branch = this.formValue.value.branch;
    const status = this.formValue.value.status;
    const userType = this.formValue.value.user_type;
    const dep= this.formValue.value.dep;

    console.log("fullName : "+fullName);
    console.log("employeeCode : "+employeeCode);
    console.log("grade : "+grade);
    console.log("designation : "+designation);
    console.log("email : "+email);
    console.log("region : "+region);
    console.log("branch : "+branch);
    console.log("status : "+status);
    console.log("userType : "+userType);
    console.log("dep : "+dep);
    if (userType === 'DRC' && (!dep || dep.trim() === '')) {
      // Display an error message or take appropriate action
      const config = new MatSnackBarConfig();
      config.duration = 5000; // Set the duration for the toast message
      config.panelClass = ['larger-width-snackbar']; // Add a custom class for styling
  
      this._snackBar.open('Department is required for DRC.', 'Close', config);
      return;
    }
    const created_by=this.logged_id;
    // console.log('Name:', fullName);
    // console.log('user id ', created_by);

if (!fullName || fullName.trim() === '' || !employeeCode || employeeCode.trim() === '' || !grade || grade.trim() === '' || !designation || designation.trim() === '' || !email || email.trim() === '' || !region || !branch || !userType || userType.trim() === '' || !status || status.trim() === '') {
  console.log('inside validation ');
  this.not_filled = true;
  setTimeout(() => {
    this.not_filled = false;
  }, 3000); // 3000 milliseconds (3 seconds)
  return;
}
    if (!this.isValidEmail(email)) {
      // alert('Please enter a valid email address.');
      const config = new MatSnackBarConfig();
      config.duration = 5000; // Set the duration for the toast message
      config.panelClass = ['larger-width-snackbar']; 
  
      this._snackBar.open('Please enter a valid email address.', 'Close', config);
      return;
    }

    if (!employeeCodePattern.test(employeeCode)) {
      // console.log('Employee code is not in the correct format (sdbl followed by numbers).');
      const config = new MatSnackBarConfig();
      config.duration = 5000; 
      config.panelClass = ['larger-width-snackbar']; // Add a custom class for styling
  
      this._snackBar.open('Employee code is not in the correct format (sdbl followed by numbers)', 'Close', config);
  
     
      return;
    } 
     // Convert string values to numbers
    const branchId = parseInt(branch);
    const regionId = parseInt(region);


    // Update UserModel  
    this.usermodel_obj.fullName = fullName;
    this.usermodel_obj.employeeCode = employeeCode;
    this.usermodel_obj.grade = grade;
    this.usermodel_obj.designation = designation;
    this.usermodel_obj.email = email;
    this.usermodel_obj.region.regionId = regionId;  
    this.usermodel_obj.branch.branchId = branchId;  
    this.usermodel_obj.status = status;
    this.usermodel_obj.userType = userType;  
    this.usermodel_obj.createdBy = created_by;  
    this.usermodel_obj.depId = dep;
    
    // console.log("dep id : "+this.usermodel_obj.depId );
    this.userService.postUser(this.usermodel_obj).subscribe(
      (res) => {
        this.showSuccessMessage = true;
        this.successMessage = res.message;
        setTimeout(() => {
          this.hideSuccess();
          this.formValue.reset();
          this.getPosts();
          this.showContent = true;
          this.showForm = false;
        }, 3000);

       
      },
      (err) => {
        
        this.successMessage = err.message;
        setTimeout(() => {
         this.hideSuccess();
       }, 3000); 
      }
    );
  }
  



  hideSuccess() {
    this.showSuccessMessage = false;
  }

  isValidEmail(email: string): boolean {
    // Basic email validation using a regular expression
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

updateUserDetails() {

    const userId = this.formValue.value.userId;
    const fullName = this.formValue.value.name;
    const employeeCode = this.formValue.value.emp_code;
    const grade = this.formValue.value.grade;
    const designation = this.formValue.value.designation;
    const email = this.formValue.value.email;
    const region = this.formValue.value.region;
    const branch = this.formValue.value.branch;
    const status = this.formValue.value.status;
    const userType = this.formValue.value.user_type;
    const dep = this.formValue.value.dep;
    const updated_by=this.logged_id;
  
    // Basic validation checks
    if ( !fullName || !employeeCode || !grade || !designation || !email || !region || !branch || !status || !userType) {
    
      this.showSuccessMessage = true;
      this.successMessage = 'Please fill in all fields';
      return;

    }

    if (!this.isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

      // Convert string values to numbers
      const branchId = parseInt(branch);
      const regionId = parseInt(region);
    this.usermodel_obj.userId = userId;
    this.usermodel_obj.fullName = fullName;
    this.usermodel_obj.employeeCode = employeeCode;
    this.usermodel_obj.grade = grade;
    this.usermodel_obj.designation = designation;
    this.usermodel_obj.email = email;
    this.usermodel_obj.region.regionId = regionId;  
    this.usermodel_obj.branch.branchId = branchId;  
    this.usermodel_obj.status = status;
    this.usermodel_obj.userType = userType;
    this.usermodel_obj.updatedBy=updated_by;
    this.usermodel_obj.depId=dep;

    this.userService.updateUser(this.usermodel_obj).subscribe(
      (res) => {
        console.log(res);
    

        this.showSuccessMessage = true;
        this.successMessage = res.message;
        setTimeout(() => {
        this.hideSuccess();
        this.formValue.reset();
        this.showForm = false;
        this.showContent = true;

        this.getPosts();
        }, 3000);
      
      },
      (err) => {
       
        this.successMessage = err.message;
        setTimeout(() => {
         this.hideSuccess();
       }, 3000); 
      }
    );


}

  contentChange() {
    this.showContent = false;
    this.showForm = true;
    this.update_btn = false;
  }

  clickCancel() {
    this.formValue.reset();
    this.showContent = true;
    this.showForm = false;
    this.create_btn=true;
  }

  // pagination start here
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.userlist.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedData();
  }

  updateDisplayedData() {
    if (this.userlist) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.displayedUserList = this.userlist.slice(startIndex, endIndex);
    }
  }

  getPageArray(): number[] {
    if (this.userlist && this.userlist.length > 0) {
      const totalPages = Math.ceil(this.userlist.length / this.itemsPerPage);
      const displayedPages = 2;
  
      let startPage = Math.max(1, this.currentPage - Math.floor(displayedPages / 2));
      let endPage = Math.min(totalPages, startPage + displayedPages - 1);
  
      if (totalPages <= displayedPages) {
        startPage = 1;
        endPage = totalPages;
      } else if (endPage - startPage + 1 < displayedPages) {
        startPage = Math.max(1, endPage - displayedPages + 1);
      }
  
      return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    } else {
      return [];
    }
  }
  // pagination close here 
  
  


}
