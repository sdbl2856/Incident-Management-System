import { Component,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IncidentModel } from './incident-model';
import { IncidentService } from './incident.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/auth.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user/user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

declare var $: any; // Import jQuery globally

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.scss'],
})
export class IncidentComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    $("#input-folder-3").fileinput({
      theme: 'fas',  
      browseLabel: 'Select File...',
      showUpload: false, 
      showRemove: true,
      allowedFileExtensions: ['jpg', 'png', 'pdf', 'docx'],
      previewFileType: 'any',
      // uploadUrl: "/file-upload-batch/2",
      hideThumbnailContent: true 
    });
  }
  
  risk_causes: any[];
  sub_category: any[];
  sub_types: any[];
  loading = true;
  specificSubCategory = [];
  specificSubTypes = [];
  formValue: FormGroup;
  selectedOption: string = '';
  incidentmodel_obj: IncidentModel = new IncidentModel();
  showform = true;
  userData:any;
  reporting_officer: any; // Add this line
  contact_number: any; // Add this line
  id: number = 1;
  description: any;
  oc_date: any;
  detected_date: any;
  reporting_date: any;
  risk_owner: any;
  currentLevel: any;
  empCode: any;
  email: any;
  created_level: any;
  loggedUserId: number = 0;
  branch: any;
  not_filled = false;
  next_level: any;
  type_RC = true;
  type_DRC = false;
  incidentCount:number;
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  branches: any[];
  regions: any[];
  user_types: any[] = [];
  departments: any[] = []; // Initialize as an empty array
  filteredDepartments: any[] = []; // Initialize as an empty array
  selectedLevel: string = '';
  branch_div: boolean = false;
  region_div: boolean = false;
  any_user_div=true;
  dep_div: boolean = false;
  showSDBLError: boolean = false;
  errorMessage: string = '';
  mobile:any;
  uploadedFiles: File[] = []; // Initialize as an empty array
  branchCode:any;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private incidentService: IncidentService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private _snackBar: MatSnackBar
  ) {
    
  }

  // sdbLValidator(control: any) {
  //   const value = control.value;
  //   const isValid = /^SDBL\d+$/.test(value);
  //   if (!isValid && value !== '') {
  //     return { 'invalidSDBL': true };
  //   }
  //   return null;
  // }

  pastDateValidator(): ValidatorFn {
    
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();

      if (selectedDate > currentDate) {
        return { futureDate: true };
      }

      return null;
    };
  }

  ngOnInit() {

    this.formValue = this.formBuilder.group({
      description: [''],
      oc_date: ['', [Validators.required, this.pastDateValidator()]],
      detected_date: ['', [Validators.required, this.pastDateValidator()]],
      reporting_date: [''],
      risk_owner: [''],
      risk_cause: [''],
      sub_category: [''],
      sub_type: [''],
      // reporting_officer: ['', [Validators.required, this.sdbLValidator]],
      contact_number: [''],
      potential_amount: ['0', Validators.required],
      recoverd_amount: ['0'],
      actual_loss_amount : ['0'],
      account_number: [''],
      recovery_action: [''],
      level: ['', Validators.required],
      branch: ['', Validators.required],
      region: ['', Validators.required],
      dep: [''],
      uploadedFiles: [''],
    });

    this.getBranches();
    this.getRiskCauses();

    // this.formValue.get("level").setValue("BRANCH");
    // this.onLevelChange({ target: { value: "BRANCH" } });

    this.currentLevel = this.authService.getLevel();
    console.log("current level : "+this.currentLevel);

    this.empCode = this.authService.getempCode();
    console.log("emp code  : "+this.empCode);

    let employeeCode = this.empCode;
    if (employeeCode.toLowerCase().startsWith("sdbl")) {
      employeeCode = employeeCode.substring(4);
    }
    console.log(employeeCode);
    
    
  

    this.email = this.authService.getEmail();
    console.log("current email : "+this.email);

    this.mobile = this.authService.getMobile();
    console.log("current Mobile : "+this.mobile);

    console.log(this.branchCode);
    if (this.currentLevel != 'NU') {
      this.any_user_div=false;
      
    }else if(this.currentLevel == 'NU'){
      this.getName(employeeCode);
    }

    this.loggedUserId = Number(this.authService.getId());
    // console.log("logged user id: "+this.loggedUserId);

    this.branch = this.authService.getBranch();
    this.incidentCount = this.authService.getIncidentCount();
    this.authService.setIncidentCount(this.incidentCount);
    

    // console.log("branch *: "+this.branch);
  }

  

  disableDate() {
    return false;
  }




  onLevelChange(event: any) {
    // Access the selected value from the event
    const selectedValue = event.target.value;
    this.formValue.value.dep='';
    this.formValue.value.region='';
    this.formValue.value.branch='';
    // Log the selected value
    console.log('Level changed:', selectedValue);

    // Assign the selected value to the selectedLevel variable
    this.selectedLevel = selectedValue;
    this.branch_div = this.selectedLevel === 'BRANCH';
    this.region_div = this.selectedLevel === 'REGION';
    this.dep_div = this.selectedLevel === 'DEPARTMENT';

    if(this.selectedLevel === 'BRANCH'){
      this.formValue.patchValue({
        region: '',  // Reset region
        dep: ''      // Reset department
    });
      this.created_level='BS'
      

    } if(this.selectedLevel === 'REGION'){
      this.formValue.patchValue({
        branch: '',  // Reset branch
        dep: ''      // Reset department
    });
      this.created_level='RS'
    } else if (this.selectedLevel === 'DEPARTMENT') {
      this.formValue.patchValue({
        branch: '',  // Reset branch
        region: ''   // Reset region
    });
      this.dep_div = true;
      // this.currentLevel = 'DS'; 
      this.created_level = 'DS'; 
    }


  }



  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.uploadedFiles = Array.from(files); // Convert FileList to Array
  
    console.log("Selected Files:", this.uploadedFiles);
  
    let formData = new FormData();
    if (this.uploadedFiles.length > 0) {
      this.uploadedFiles.forEach(file => {
        formData.append('files', file, file.name);
      });
    } else {
      formData.append('files', null);
    }
  }

  
  postDetails() {
    
    console.log("current level : " + this.currentLevel);

    let formData = new FormData();
    if (this.uploadedFiles && this.uploadedFiles.length > 0) {
      this.uploadedFiles.forEach((file, index) => {
        formData.append(`files`, file, file.name); // 
      });
    } else {
      formData.append('files', null); // Append null if no file selected
    }
  
    
    formData.forEach((value, key) => {
      console.log(key, value); 
    });
    
  
  
    if(this.currentLevel == 'NU'){

      if (this.created_level == 'DS') {
        this.next_level = 'DRC';
      }
      else if (this.created_level == 'BS') {
        this.next_level = 'RC';
      }
      else if (this.created_level == 'RS') {
        this.next_level = 'RRC';
      }
    }else{
       if (this.currentLevel == 'RC') {
        this.next_level = 'BM';
      } else if (this.currentLevel == 'BM' || this.currentLevel == 'RM') {
        this.next_level = 'RO';
      } else if (this.currentLevel == 'RO') {
        this.next_level = 'ORM';
      } else if (this.currentLevel == 'RRC') {
        this.next_level = 'RM';
      } else if (this.currentLevel == 'DRC') {
        this.next_level = 'RO';
      } else if (this.currentLevel == 'AU') {
        this.next_level = 'DRC';
        this.created_level = 'DS'
      }

    }

 
    const {
      description,
      oc_date,
      detected_date,
      risk_owner,
      risk_cause,
      sub_category,
      sub_type,
      reporting_officer,
      // contact_number,
      recovery_action,
      account_number,
      actual_loss_amount,
      potential_amount,
      recoverd_amount,
      branch,
      region,
      dep
    } = this.formValue.value;
  
   

    if (
      description !== null && description.trim() !== '' &&
    
      oc_date !== null && oc_date.trim() !== '' &&
      detected_date !== null && detected_date.trim() !== '' &&
      risk_owner !== null && risk_owner.trim() !== '' &&
      risk_cause !== null && risk_cause.trim() !== '' &&
      sub_category !== null && sub_category.trim() !== '' &&
      sub_type !== null && sub_type.trim() !== ''
      // reporting_officer !== null && reporting_officer.trim() !== '' &&
      // contact_number !== null && contact_number.trim() !== ''
    ){
      
      console.log({ branch, region, dep});

      if (this.currentLevel == 'NU') {
        console.log("inside this.currentLevel = NU ");
        
        if (this.formValue.value.level === '' || this.formValue.value.level == null) {
            console.log("inside reporting level empty ");
            this.not_filled = true;   
            setTimeout(() => {
                this.not_filled = false;
            }, 3000);
            return;
        } else if (this.formValue.value.level) {
            console.log("inside reporting level Not empty ");
            // const emailEmpty = email ==null || email.trim() == '';
            const isBranchEmpty = branch == null || branch.trim() == '';
            const isRegionEmpty = region == null || region.trim() == '';
            const isDepEmpty = dep == null || (typeof dep === 'string' && dep.trim() === '');


            console.log({ isBranchEmpty, isRegionEmpty, isDepEmpty });
//              t             t                 f               t
            if ((isBranchEmpty && isRegionEmpty && isDepEmpty)) {
                this.not_filled = true;   
                setTimeout(() => {
                this.not_filled = false;
                }, 3000);
        
                return;
            }    
        }
    }
    
     
      if (this.formValue.get('oc_date').hasError('futureDate') || this.formValue.get('detected_date').hasError('futureDate')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Date!',
          text: 'Detected Date and Occurence Date should be present or in the Past.',
          confirmButtonText: 'OK',
        });
      } 
      else if (detected_date < oc_date) {
        Swal.fire({
          icon: 'error',
          title: 'Date Error!',
          text: 'Detected date should be after or equal to the occurrence date!',
          confirmButtonText: 'OK',
        });
      }

      else {
        console.log("inside assign ");
        let data:any;

        data= {

            inc_description : description,
            occurence_date : oc_date,
            detected_date : detected_date,
            risk_owner :risk_owner,
            // riskCause :risk_cause,
            // riskSubCategory :sub_category,
            sub_type : { riskSubTypeId: sub_type },
            created_Level : this.created_level,
            next_level : this.next_level,
            createdBy : this.loggedUserId,
            reporting_officer : this.empCode,
            contact_number : this.mobile,
            recovery_action : recovery_action,
            account_number :account_number,
            actual_amount : actual_loss_amount,
            potential_amount : potential_amount,
            recoverd_amount : recoverd_amount,
            level : this.selectedLevel,
            branchId : branch || 999,
            regionId :region || 11,
            depId : dep,
            email :this.email

        }
        // this.incidentmodel_obj.inc_description = description;
        // this.incidentmodel_obj.occurence_date = oc_date;
        // this.incidentmodel_obj.detected_date = detected_date;
        // this.incidentmodel_obj.risk_owner = risk_owner;
        // // this.incidentmodel_obj.risk_cause = risk_cause;
        // // this.incidentmodel_obj.sub_category = sub_category;
        // this.incidentmodel_obj.sub_type = { riskSubTypeId: sub_type };
        // // this.incidentmodel_obj.currentLevel = this.currentLevel;
        // this.incidentmodel_obj.created_Level = this.created_level;
        // this.incidentmodel_obj.next_level = this.next_level;
        // this.incidentmodel_obj.createdBy = this.loggedUserId;
        // this.incidentmodel_obj.reporting_officer = this.empCode;
        // this.incidentmodel_obj.contact_number = this.mobile;
        // this.incidentmodel_obj.recovery_action = recovery_action;
        // this.incidentmodel_obj.account_number = account_number;
        // this.incidentmodel_obj.actual_amount = actual_loss_amount;
        // this.incidentmodel_obj.potential_amount = potential_amount;
        // this.incidentmodel_obj.recoverd_amount = recoverd_amount;
        // this.incidentmodel_obj.level = this.selectedLevel;
        // this.incidentmodel_obj.branchId = branch || 999;
        // this.incidentmodel_obj.regionId = region || 11;
        // this.incidentmodel_obj.depId = dep;
        // this.incidentmodel_obj.email = this.email;
  
        formData.append('incidentDTO', JSON.stringify(data));

        // console.log("sending object : "+JSON.stringify(this.incidentmodel_obj));
        // this.loading = false;
        console.log("FormData content:");
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        // this.incidentService.postIncidents(this.loggedUserId, formData).subscribe((response:any) => {
        //   if(response['code'] == 200){             
        //     this.loading = true;  
        //     this.alertWithSuccess(); 
        //     this.formValue.reset();
        //     this.branch_div=false;
        //     this.dep_div=false;
        //     this.region_div=false;
        //     this.selectedOption = null; 
        //     $("#input-folder-3").fileinput('clear'); 
    
        //   }else{         
        //     this.loading = true;        
        //     this.alertWithError(response['error']);      
        //   }
        //     },
        //   );
      }
    } else {

      this.loading = true;  
      console.log('inside else');
      this.not_filled = true;
  
      setTimeout(() => {
        this.not_filled = false;
      }, 3000);
    }
   
  }




  getRiskCauses() {
    this.incidentService.getRiskCauses().subscribe((data: any) => {
      // console.log(data);
      this.risk_causes = data.riskCauseList;
      this.sub_category = data.riskSubCategoryList;
      this.sub_types = data.riskSubTypeList;

      // console.log(this.risk_causes);
      // console.log(this.sub_category);
      // console.log(this.sub_types);
    });
  }


  onRiskChange() {

    this.specificSubCategory = [];
  
    // Reset subcategory control
    this.formValue.get('sub_category')?.setValue(null);
    // console.log(this.formValue.get('sub_category')?.value);
  
    const selectedRiskCauseId = this.formValue.get('risk_cause')?.value;
  
    for (let i = 0; i < this.sub_category.length; i++) {
      if (this.sub_category[i].riskcause.risk_causeId == selectedRiskCauseId) {
        this.specificSubCategory.push(this.sub_category[i]);
     
      }
      
    }
    // Build the explanationMap dynamically
    this.explanationMap = {};
    for (let i = 0; i < this.risk_causes.length; i++) {
      const riskCause = this.risk_causes[i];
      this.explanationMap[String(riskCause.risk_causeId)] = riskCause.explanation;
    }
    // Update selectedOption for the explanation
    this.selectedOption = String(selectedRiskCauseId);
  
 
    this.specificSubTypes = [];

  }
  
  
  explanationMap: { [key: string]: string } = {};  // Initialize as an empty object
  
  onSubCategoryChange() {
    this.specificSubTypes = [];
    const selectedSubCat_Id = this.formValue.get('sub_category')?.value;
    this.formValue.get('sub_type')?.setValue(null);

    for (let i = 0; i < this.sub_types.length; i++) {
      // Check if risk_cause is defined before accessing its properties
      if (this.sub_types[i].riskSubCategory.risk_causeId == selectedSubCat_Id) {
        this.specificSubTypes.push(this.sub_types[i]);
      }
    }

    // console.log('Specific sub Types:', this.specificSubTypes);
    // this.specificSubTypes = [];
  }
 
  validate(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = parseFloat(inputElement.value).toFixed(2);
    this.formValue.get('potential_amount').setValue(inputElement.value);
  }

  getBranches() {
    this.userService.getBranches().subscribe((data: any) => {
      // console.log(data);
      this.branches = data.branchList;
      this.regions = data.regions;
      this.departments = data.departmentList;
      this.user_types = data.usertypeList;             
      console.log(this.branches);
      this.filterDepartments();

      // console.log(this.branches);
      // console.log(this.regions);
      // console.log(this.user_types);
    });
  }
  
  prependSDBL(event: any) {
    // Get the input value
    let input = event.target.value;

    // Remove the SDBL prefix if it exists to check for numeric input
    if (input.startsWith('SDBL')) {
      input = input.slice(4);
    }

    // Check if the remaining input is numeric
    if (!/^\d*$/.test(input)) {
      // If not numeric, remove the last character
      event.target.value = event.target.value.slice(0, -1);
      return;
    }

    // Prepend SDBL if not already present
    if (!event.target.value.startsWith('SDBL')) {
      event.target.value = 'SDBL' + input;
    }
  }


  filterDepartments() {
    // Filter out the department you want to hide
    this.filteredDepartments = this.departments.filter(department => department.description !== 'N/A');
}

  hideSuccess() {
    this.showSuccessMessage = false;
  }


  clickCancel() {
    this.formValue.reset();
    // this.router.navigate(['/login']);
  }



  alertWithSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Success...',
      text: 'Successfully Done',
      confirmButtonColor: "#238df7",
      showClass: {
        popup: 'animate__animated animate__fadeInDown' 
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp' 
      }
    });
  } 

  alertWithError(msg: any){
    Swal.fire({
      icon: 'error',
      title: 'Error...',
      text: msg,
      confirmButtonColor: "#03c9d7",
      showClass: {
        popup: 'animate__animated animate__fadeInDown' 
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp' 
      }
    });  
  }





   getName(event: any) {

    const value = event; 
    console.log("Entered value:", value);
    this.branchCode;
   

    if(value != '' || value !=0 || value !=1){
         // Call your service to get the data
    this.incidentService.getName(value).subscribe(
      (data: any) => {
        this.userData = data.hr; 
        console.log("Received", this.userData);
        if (this.userData && this.userData) {
          try {
            const parsedResponse = JSON.parse(this.userData);  
            this.branchCode = parsedResponse.data ? parsedResponse.data.emp_branch_code : null;  
            this.email = parsedResponse.data ? parsedResponse.data.emp_email : null;  
            this.mobile = parsedResponse.data ? parsedResponse.data.emp_mob1 : null;  
            console.log("branchCode:",this.branchCode);  
            if (this.branchCode) {

                if(this.branchCode == 123){
                  this.any_user_div=false;
                const DBCode = this.departments.find((item: any) => item.hrCode == this.branchCode);
                console.log(DBCode?.departmentId);
                this.formValue.get("level").setValue("DEPARTMENT");
                this.selectedLevel='DEPARTMENT';
                this.formValue.get("dep").setValue(DBCode?.departmentId);
                this.created_level='DS'
                }else if(this.branchCode != 123){
              
                // Filter out the department you want to hide
                    this.filteredDepartments = this.departments.filter(department => department.description !== 'N/A' && department.description !== 'IT Division');
                  

                }

              // if(branchCode > 95){
              //   const DBCode = this.departments.find((item: any) => item.hrCode == branchCode);
              //   console.log(DBCode?.departmentId);
              //   this.formValue.get("level").setValue("DEPARTMENT");
              //   this.selectedLevel='DEPARTMENT';
              //   this.formValue.get("dep").setValue(DBCode?.departmentId);
              //   this.created_level='DS'

              // }else if(branchCode <= 95){
              //   const DBCode = this.branches.find((item: any) => item.hrCode == branchCode);
              //   console.log(DBCode?.branchId);
              //   this.formValue.get("level").setValue("BRANCH");
              //   this.selectedLevel='BRANCH';
              //   this.formValue.get("branch").setValue(DBCode?.branchId);
              //   this.formValue.get("dep").setValue(0);
              //   this.created_level='BS'
              // }

            } else { 

              console.log("branchCode not found in the response.");
            }
        
          } catch (error) {
            console.log("Error parsing the response JSON:", error);
          }
        } else {
   
          console.log("Response or data not available.");
        }
      },
      (error: any) => {
        console.error("Error occurred", error);
      }
    );

    }if(value == ''){
      console.log("inside else");
     
    }
  
 
  }




}
