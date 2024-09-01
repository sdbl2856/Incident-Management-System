import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IncidentModel } from './incident-model';
import { IncidentService } from './incident.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/auth.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user/user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.scss'],
})
export class IncidentComponent {
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

  reporting_officer: any; // Add this line
  contact_number: any; // Add this line
  id: number = 1;
  description: any;
  oc_date: any;
  detected_date: any;
  reporting_date: any;
  risk_owner: any;
  currentLevel: any;
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
  departments: any[];
  selectedLevel: string = '';
  branch_div: boolean = false;
  region_div: boolean = false;
  any_user_div=true;
  dep_div: boolean = false;
  showSDBLError: boolean = false;
  errorMessage: string = '';
  

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private incidentService: IncidentService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private _snackBar: MatSnackBar
  ) {
    this.formValue = this.formBuilder.group({
      description: [''],
      oc_date: ['', [Validators.required, this.pastDateValidator()]],
      detected_date: ['', [Validators.required, this.pastDateValidator()]],
      reporting_date: [''],
      risk_owner: [''],
      risk_cause: [''],
      sub_category: [''],
      sub_type: [''],
      reporting_officer: ['', [Validators.required, this.sdbLValidator]],
      contact_number: [''],
      potential_amount: ['', Validators.required],
      recoverd_amount: [''],
      actual_loss_amount : [''],
      account_number: [''],
      recovery_action: [''],
      level: ['', Validators.required],
      branch: ['', Validators.required],
      region: ['', Validators.required],
      email: [''],
      dep: [''],
    });
  }

  sdbLValidator(control: any) {
    const value = control.value;
    const isValid = /^SDBL\d+$/.test(value);
    if (!isValid && value !== '') {
      return { 'invalidSDBL': true };
    }
    return null;
  }

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
    this.getBranches();
    this.getRiskCauses();

    this.currentLevel = this.authService.getLevel();
    console.log("current level : "+this.currentLevel);
    if (this.currentLevel != null) {
      this.any_user_div=false;

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

    // Log the selected value
    console.log('Level changed:', selectedValue);

    // Assign the selected value to the selectedLevel variable
    this.selectedLevel = selectedValue;
    this.branch_div = this.selectedLevel === 'BRANCH';
    this.region_div = this.selectedLevel === 'REGION';
    this.dep_div = this.selectedLevel === 'DEPARTMENT';

    if(this.selectedLevel === 'BRANCH'){
      this.currentLevel='BS'
      this.created_level='BS'

    } if(this.selectedLevel === 'REGION'){
      this.currentLevel='RS'
      this.created_level='RS'
    } else if (this.selectedLevel === 'DEPARTMENT') {
      // Set dep_div to true when DEPARTMENT is selected
      this.dep_div = true;
      this.currentLevel = 'DS'; 
      this.created_level = 'DS'; 
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
      // this.specificBranches = this.branches;

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


  // postDetails() {
  //   const reportingOfficer = this.formValue.value.reporting_officer;
  
  //   // Ensure the value starts with 'SDBL' and is followed by digits
  //   const isValid = /^SDBL\d+$/.test(reportingOfficer);
  
  //   if (isValid) {
  //     console.log("repo officer: " + reportingOfficer);
  //   } else {
  //     console.log("Invalid SDBL number");
  //   }
  // }
  

  postDetails() {

    // this.loading=false;
    console.log("current level : " + this.currentLevel);
  
    if (this.currentLevel == 'DS') {
      this.next_level = 'DRC';
    }
    else if (this.currentLevel == 'BS') {
      this.next_level = 'RC';
    }
    else if (this.currentLevel == 'RS') {
      this.next_level = 'RRC';
    }
    else if (this.currentLevel == 'RC') {
      this.next_level = 'BM';
    } else if (this.currentLevel == 'BM' || this.currentLevel == 'RM') {
      this.next_level = 'RO';
    } else if (this.currentLevel == 'RO') {
      this.next_level = 'ORM';
    } else if (this.currentLevel == 'RRC') {
      this.next_level = 'RM';
    } else if (this.currentLevel == 'DRC') {
      this.next_level = 'RO';
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
      contact_number,
      recovery_action,
      account_number,
      actual_loss_amount,
      potential_amount,
      recoverd_amount,
      branch,
      region,
      email,
      dep
    } = this.formValue.value;
  
    const sriLankanPhoneNumberPattern = /^(?:\+94|0)?[1-9]\d{8}$/;
    const isValidPhoneNumber = sriLankanPhoneNumberPattern.test(contact_number);
  {


    console.log('branch :', branch);
    console.log('region:', region);
    console.log('email :', email);
    console.log('dep :', dep);
  
  }
   
    if (
      description !== null && description.trim() !== '' &&
      isValidPhoneNumber &&
      oc_date !== null && oc_date.trim() !== '' &&
      detected_date !== null && detected_date.trim() !== '' &&
      risk_owner !== null && risk_owner.trim() !== '' &&
      risk_cause !== null && risk_cause.trim() !== '' &&
      sub_category !== null && sub_category.trim() !== '' &&
      sub_type !== null && sub_type.trim() !== '' &&
      reporting_officer !== null && reporting_officer.trim() !== '' &&
      contact_number !== null && contact_number.trim() !== ''
    ) {
        

      if (this.currentLevel == 'BS' || this.currentLevel == 'DS' || this.currentLevel == 'RS') {
        console.log("inside other user");
      
        let shouldAlert = false;
      
        if (this.currentLevel == 'BS') {
          if (!(this.branch_div && branch !== null && branch.trim() !== '' && email !== null && email.trim() !== '')) {
              console.log("bs level");

              this.not_filled = true;
              setTimeout(() => {
                this.not_filled = false;
              }, 3000);
              return;
          

         
          }
         
        } else if (this.currentLevel == 'RS') {
          if (!(this.region_div && region !== null && region.trim() !== '' && email !== null && email.trim() !== '')) {
            this.not_filled = true;
            setTimeout(() => {
              this.not_filled = false;
            }, 3000);
            return;
          }
        } else if (this.currentLevel == 'DS') {
          if (!(this.dep_div && dep !== null && dep.trim() !== '' && email !== null && email.trim() !== '')) {
            this.not_filled = true;
            setTimeout(() => {
              this.not_filled = false;
            }, 3000);
            return;
          }
        }
      

      }
      
      const reportingOfficer = this.formValue.value.reporting_officer;
  
      // Ensure the value starts with 'SDBL' and is followed by digits
      const isValid = /^SDBL\d+$/.test(reportingOfficer);
    
      if (isValid) {
        console.log("repo officer: " + reportingOfficer);
        this.showSDBLError = false; // Hide error if valid
      } else {
      
         this.errorMessage = 'Invalid SDBL number';
         this.showSDBLError = true; // Show error if invalid
         return;
      }
      if (this.formValue.get('oc_date').hasError('futureDate') || this.formValue.get('detected_date').hasError('futureDate')) {
        alert('detected_date and oc_date should be present or in the past.');
      } 
      else if (detected_date < oc_date) {
        alert('Detected date should be after or equal to the occurrence date!');
      } 

      else {
        console.log("inside assign ");
        this.incidentmodel_obj.inc_description = description;
        this.incidentmodel_obj.occurence_date = oc_date;
        this.incidentmodel_obj.detected_date = detected_date;
        this.incidentmodel_obj.risk_owner = risk_owner;
        this.incidentmodel_obj.risk_cause = risk_cause;
        this.incidentmodel_obj.sub_category = sub_category;
        this.incidentmodel_obj.sub_type = { riskSubTypeId: sub_type };
        this.incidentmodel_obj.currentLevel = this.currentLevel;
        this.incidentmodel_obj.created_Level = this.created_level;
        this.incidentmodel_obj.next_level = this.next_level;
        this.incidentmodel_obj.createdBy = this.loggedUserId;
        this.incidentmodel_obj.reporting_officer = reporting_officer;
        this.incidentmodel_obj.contact_number = contact_number;
        this.incidentmodel_obj.recovery_action = recovery_action;
        this.incidentmodel_obj.account_number = account_number;
        this.incidentmodel_obj.actual_amount = actual_loss_amount;
        this.incidentmodel_obj.potential_amount = potential_amount;
        this.incidentmodel_obj.recoverd_amount = recoverd_amount;
        this.incidentmodel_obj.level = this.selectedLevel;
        this.incidentmodel_obj.branchId = branch;
        this.incidentmodel_obj.regionId = region;
        this.incidentmodel_obj.depId = dep;
        this.incidentmodel_obj.email = email;
  
        console.log("sending object : "+this.incidentmodel_obj);
  
        this.incidentService
          .postIncidents(this.loggedUserId, this.incidentmodel_obj)
          .subscribe(
            (res) => {
              this.loading = true;  
              console.log(res);
              this.formValue.reset();
              this.errorMessage = '';
              this.showSDBLError = false;
              this.showSuccessMessage = true;
              this.successMessage = res.message;
             
              this.selectedOption = null;
              setTimeout(() => {
                this.hideSuccess();   
              }, 3000);  
            },
            (err) => {
              this.loading = true;  
              this.showSuccessMessage = true;
              this.successMessage = err.message;
              setTimeout(() => {
                this.hideSuccess();
              }, 3000);
            },
          );
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
  


  

  hideSuccess() {
    this.showSuccessMessage = false;
  }


  clickCancel() {
    this.formValue.reset();
    this.router.navigate(['/login']);
  }



}
