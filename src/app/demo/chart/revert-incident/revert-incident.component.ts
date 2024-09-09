import { Component, ViewChild } from '@angular/core';
import { RevertIncidentService } from './revert-incident.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IncidentModel } from '../incident/incident-model';
import { AuthService } from 'src/app/login/auth.service';
import { DatePipe } from '@angular/common';
import { IncidentService } from '../incident/incident.service';
import { RiskDepartmentService } from '../risk-department/risk-department.service';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-revert-incident',
  templateUrl: './revert-incident.component.html',
  styleUrls: ['./revert-incident.component.scss'],
})
export class RevertIncidentComponent {
  @ViewChild('nav1', { static: true }) nav1: NgbNav;
  formValue: FormGroup;
  incidents: any[];
  showform = false;
  showtable = true;
  incidentmodel_obj: IncidentModel = new IncidentModel();
  userId: any;
  currentLevel:any;
  next_level:any;
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  comment: any;
  riskcauses: any;
  SubCategories: any;
  riskSubTypeList: any;
  
  row:any;
  selectedIncidentId: any;
  commentList: any[];

   // New properties for pagination
   currentPage: number = 1;
   itemsPerPage: number = 5; 
   displayedIncidentList: any[] = [];


   currentPageComment: number = 1;
   itemsPerPageComment: number = 5; 
   displayedCommentList: any[] = [];
   displayedColumns: string[] = ['description', 'commentedDate'];

  // Sorting properties
  // sortBy: string = ''; // Initialize with an empty string
  // sortDirection: string = 'asc'; // Default sorting direction
  // pagedIncidents: any[] = [];
  // maxPage: number;

  specificSubCategory = [];
  specificSubTypes= [];

  risk_causes: any[];
  sub_category: any[];
  sub_types: any[];

  consequenceList: any[];
  businessLineList: any[];
  businessAriaList: any[];
  lossEventTypeList: any[];
  incidentTypeList: any[];
  riskLevelList: any[];
  showEmtyMessage: boolean;
  emtyMessage: string;
  incidentCount:number=0;

  constructor(
    private revertIncidentService: RevertIncidentService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe,
    private incidentService: IncidentService,
    private riskDepartmentService :RiskDepartmentService
  ) {
    this.formValue = this.formBuilder.group({
      id: [''],
      description: [''],
      oc_date: [''],
      detected_date: [''],
      reporting_date: [''],
      risk_owner: [''],
      risk_cause: [''],
      subtype: [null, Validators.required],
      subcat: [null, Validators.required],
      sub_type: [''],
      contact_number: [''],
      reporting_officer: [''],
      action: ['null'],
      incident_type: [''],
      loss_event_type: [''],
      business_line: [''],
      business_aria: [''],
      consequence: [''],
      risk_level: ['0'],
      root_cause: ['null'],
      potential_amount: [''],
      actual_amount: [''],
      comment: [''],
      recovery_action: ['null'],
      recoverd_amount: ['0'],
      account_number: ['123456'],
    });
  
  }


  ngOnInit() {
    
    this.userId = this.authService.getId();
    this.currentLevel = this.authService.getLevel();
    this.getRiskCauses();
    this.getPosts(this.userId, 'RE');
    this.updateIncidentCount();
   
    // console.log('Incidents count from ngOnInit: ' + this.incidentCount);
  }
  
  getPosts(userId: any, selectedStatus: string | undefined = undefined) {
    if (this.userId) {
      console.log('Selected Incident ID:', this.selectedIncidentId);
      // Include the selectedStatus parameter in the service call
      this.riskDepartmentService.getPosts(this.userId, selectedStatus)
        .subscribe((data: any) => {
          console.log('Service Response:', data);
          if (data.code === 200) {
            this.commentList = [];
  
            data.incidentDtoList.forEach((incident) => {
              if (incident.comment) {
                incident.comment.forEach((comment) => {
                  // Only push comments for the selected incident
                  if (comment.incident.incidentId === this.selectedIncidentId) {
                    this.commentList.push(comment);
                  }
                });
              }
            });
  
            this.currentPageComment = 1;
            this.updateDisplayedCommentData();
  
          }
          this.incidents = data.incidentDtoList;
          this.incidentCount = this.incidents.length;
          console.log('Incident Count:', this.incidentCount);
          console.log('Incidents:', this.incidents);
          console.log('Comments:', this.commentList);
          this.updateDisplayedData();
          this.authService.setIncidentCount(this.incidentCount);
        });
    } else {
      console.error('userId is undefined');
    }
    
  }
  
  updateIncidentCount() {
    if (!this.incidents) {
      console.log('Incidents array is not defined.');
      return;
    }

    this.incidentCount = this.incidents.length;
    localStorage.setItem('incidentCount', this.incidentCount.toString());
    this.authService.setIncidentCount(this.incidentCount);
   
  }

  disableDate() {
    return false;
  }
  clickTab1(){
    this.nav1.select(1);
    this.showtable=true;
    this.showform=false;
    this.getPosts(this.userId,'RE');
    // this.showform = false;
    // this.drop_down=true;
   
    // Reset comment form
    this.formValue.reset();
    
  }

  contentChange() {
    this.showform = true;
    this.showtable = false;
  }

  clickCancel() {
    this.showform = false;
    this.showtable = true;
  }

  moveToNextTab() {
    const currentActiveTab = this.nav1.activeId;
    if (currentActiveTab < 2) {
      this.nav1.select(currentActiveTab + 1); 
    }
   
  }


  onEdit(row: any) {
    
 
    this.moveToNextTab();
    console.log(row);
    this.selectedIncidentId = row.incidentId;
    this.getPosts(this.userId,'RE');
    this.showform = true;
    this.showtable = false;
    if(this.currentLevel=="RO"){
      this.formValue.get('description')?.disable();
      this.formValue.get('contact_number')?.disable();
      this.formValue.get('reporting_officer')?.disable();
      this.formValue.get('oc_date')?.disable();
      this.formValue.get('detected_date')?.disable();
      this.formValue.get('reporting_date')?.disable();

      this.formValue.get('risk_owner')?.disable();
      this.formValue.get('risk_cause')?.disable();
      this.formValue.get('subcat')?.disable();
      this.formValue.get('subtype')?.disable();
      
      this.formValue.get('recoverd_amount')?.disable();
      this.formValue.get('account_number')?.disable();
      this.formValue.get('recovery_action')?.disable();
     
    }else {
      this.formValue.get('reporting_date')?.disable();
      this.formValue.get('action')?.disable();
      this.formValue.get('incident_type')?.disable();
      this.formValue.get('loss_event_type')?.disable();
      this.formValue.get('business_line')?.disable();
      this.formValue.get('business_aria')?.disable();
      this.formValue.get('consequence')?.disable();
      this.formValue.get('risk_level')?.disable();
      this.formValue.get('root_cause')?.disable();
      // this.formValue.get('potential_amount')?.disable();
      // this.formValue.get('actual_amount')?.disable();

    }

    this.formValue.controls['id'].setValue(row.id);
    this.formValue.controls['description'].setValue(row.inc_description);
    this.formValue.controls['contact_number'].setValue(row.contact_number);
    this.formValue.controls['reporting_officer'].setValue(row.reporting_officer);
    this.formValue.controls['account_number'].setValue(row.account_number);
    this.formValue.controls['recoverd_amount'].setValue(row.recoverd_amount);
    this.formValue.controls['recovery_action'].setValue(row.recovery_action);



    this.formValue.controls['oc_date'].setValue(
      this.datePipe.transform(row.occurence_date, 'yyyy-MM-dd'),
    );
    this.formValue.controls['detected_date'].setValue(
      this.datePipe.transform(row.detected_date, 'yyyy-MM-dd'),
    );

    this.formValue.controls['reporting_date'].setValue(
      this.datePipe.transform(row.reporting_date, 'yyyy-MM-dd'),
    );
    this.formValue.controls['risk_owner'].setValue(row.risk_owner);

    this.formValue.controls['risk_cause'].setValue(
      row.sub_type.riskCause.risk_causeId,
    );

    this.onRiskChange();

    this.formValue.controls['subcat'].setValue(
      row.sub_type.riskSubCategory.risk_causeId,
    );
    this.onSubCategoryChange();
    this.formValue.controls['subtype'].setValue(row.sub_type.riskSubTypeId);

    // risk part 
    console.log(row.action);
    this.formValue.controls['action'].setValue(row.action);
    this.formValue.controls['incident_type'].setValue(row.incidentType?.incidentTypeId);
    this.formValue.controls['loss_event_type'].setValue(row.lossEventType?.lossEventTypeId);
    this.formValue.controls['business_line'].setValue(row.businessLine?.businessLineId);
    this.formValue.controls['business_aria'].setValue(row.businessAria?.businessAriaId);
    this.formValue.controls['consequence'].setValue(row.consequence?.consequenceId);
    this.formValue.controls['risk_level'].setValue(row.riskLevel?.riskLevelId);

    this.formValue.controls['root_cause'].setValue(row.rootCause);
    this.formValue.controls['potential_amount'].setValue(row.potential_amount);
    this.formValue.controls['actual_amount'].setValue(row.actual_amount);


  }

  onRiskChange() {
    // console.log("inside on risk Change");
    this.specificSubCategory = [];
    const selectedRiskCauseId = this.formValue.get('risk_cause')?.value;
  
    // console.log('Selected Risk Cause ID:', selectedRiskCauseId);
  
    for (let i = 0; i < this.sub_category.length; i++) {
      if (this.sub_category[i].riskcause.risk_causeId == selectedRiskCauseId) {
        this.specificSubCategory.push(this.sub_category[i]);
      }
    }
    // console.log('Specific sub category:', this.specificSubCategory);
  }
  
  onSubCategoryChange() {
    this.specificSubTypes = [];
    const selectedSubCat_Id = this.formValue.get('subcat')?.value;
  
    for (let i = 0; i < this.sub_types.length; i++) {
      // Check if riskSubCategory is defined before accessing its properties
      if (this.sub_types[i].riskSubCategory.risk_causeId == selectedSubCat_Id) {
        this.specificSubTypes.push(this.sub_types[i]);
      }
    }
  
    console.log('Specific sub Types:', this.specificSubTypes);
  }
  

  getRiskCauses() {
    this.incidentService.getRiskCauses().subscribe((data: any) => {
      // console.log(data);
      this.risk_causes = data.riskCauseList;
      this.sub_category = data.riskSubCategoryList;
      this.sub_types = data.riskSubTypeList;
      this.consequenceList=data.consequenceList;
      this.businessLineList=data.businessLineList;
      this.businessAriaList=data.businessAriaList;
      this.lossEventTypeList=data.lossEventTypeList;
      this.incidentTypeList=data.incidentTypeList;
      this.riskLevelList=data.riskLevelList;
     
      // console.log(this.sub_category);
      // console.log(this.sub_types);
    });
  }

   updateIncidents() {

        console.log('inside update incidents function');
         // Validate fields before proceeding
          if (!this.validateFields()) {
            return;
          }
  
          this.formValue.get('description')?.enable();
          this.formValue.get('contact_number')?.enable();
          this.formValue.get('reporting_officer')?.enable();
          this.formValue.get('oc_date')?.enable();
          this.formValue.get('detected_date')?.enable();
          this.formValue.get('risk_owner')?.enable();
          this.formValue.get('risk_cause')?.enable();
          this.formValue.get('subcat')?.enable();
          this.formValue.get('subtype')?.enable();
          this.formValue.get('action')?.enable();
          this.formValue.get('incident_type')?.enable();
          this.formValue.get('loss_event_type')?.enable();
          this.formValue.get('business_line')?.enable();
          this.formValue.get('business_aria')?.enable();
          this.formValue.get('consequence')?.enable();
          this.formValue.get('risk_level')?.enable();
          this.formValue.get('root_cause')?.enable();
          this.formValue.get('potential_amount')?.enable();
          this.formValue.get('actual_amount')?.enable();
          

          const userId=this.userId;
          const incidentId = this.selectedIncidentId;
          console.log(incidentId);
          const description = this.formValue.value.description;
          const oc_date = this.formValue.value.oc_date;
          const detected_date = this.formValue.value.detected_date;
          const reporting_date = this.formValue.value.reporting_date;
          const risk_owner = this.formValue.value.risk_owner;
          const risk_cause = this.formValue.value.risk_cause;
          const sub_category = this.formValue.value.sub_category;
          const sub_type = this.formValue.value.subtype;

          const recovery_action = this.formValue.value.recovery_action;
          const recoverd_amount = this.formValue.value.recoverd_amount;
          const account_number = this.formValue.value.account_number;

          // risk part
         
          const comment = this.formValue.value.comment;
          const IncidentTypeId = this.formValue.value.incident_type;
          const loss_event_typeId = this.formValue.value.loss_event_type;
          const business_lineId= this.formValue.value.business_line;
          const business_ariaId = this.formValue.value.business_aria;
          const risk_dep_status = this.formValue.value.risk_dep_status;
          const consequenceId = this.formValue.value.consequence;
          const risk_levelId = this.formValue.value.risk_level;
          const root_cause = this.formValue.value.root_cause;
          const action_taken = this.formValue.value.action;
          const actual_amount = this.formValue.value.actual_amount;
          const potential_amount = this.formValue.value.potential_amount;
          if(comment == null || !comment ){
            // Display an error message to the user
         alert("fill all")
         
         }else{
          console.log(action_taken);

          const incidentData = {   
            incidentId :incidentId,
            inc_description :description,
            occurence_date : oc_date,
            detected_date : detected_date,
            reporting_date : reporting_date,
            risk_owner :risk_owner,
            risk_cause : risk_cause,
            sub_category : sub_category,
            sub_type : { riskSubTypeId: sub_type },
            updatedBy : this.userId,
            recovery_action:recovery_action,
            recoverd_amount:recoverd_amount,
            account_number:account_number,

// risk part
            description: comment,
            commentedBy:userId,
            incidentTypeId: IncidentTypeId, 
            loss_event_typeId:loss_event_typeId,
            business_lineId:business_lineId,
            business_ariaId:business_ariaId,
            consequenceId:consequenceId,
            risk_levelId:risk_levelId,
            rootCause:root_cause,
            action:action_taken,
            actual_amount:actual_amount,
            potential_amount:potential_amount,
            riskDepStatusId:risk_dep_status,
            next_level:this.next_level,
    
          };


          console.log('model sent ' + incidentData);
          this.revertIncidentService
            .updateIncidents(incidentData)
            .subscribe(
              (res) => {
                this.formValue.reset();
                this.showSuccessMessage = true;
                // Store the success message from the backend
                this.successMessage = res.message;

                setTimeout(() => {
                  this.hideSuccess();
                  this.showform = false;
                  this.showtable = true;
                  this.nav1.select(1);
                  this.getPosts(this.userId,'RE');
                }, 3000);
                this.updateIncidentCount();
              },
              (err) => {
                console.log(err.message);
                this.showSuccessMessage = true;
                this.successMessage = err.message;
                setTimeout(() => {
                  this.hideSuccess();
                }, 3000);
              },
            );
        }
  }

      revertDetails(row:any) {

        // if(this.currentLevel ==''){

        // }
        // Validate fields before proceeding
         if (!this.validateFields()) {
           return;
         }

         console.log('inside risk send -back');
       

         this.formValue.get('description')?.enable();
         this.formValue.get('contact_number')?.enable();
         this.formValue.get('reporting_officer')?.enable();
         this.formValue.get('oc_date')?.enable();
         this.formValue.get('detected_date')?.enable();
         this.formValue.get('reporting_date')?.enable();
         this.formValue.get('risk_owner')?.enable();
         this.formValue.get('risk_cause')?.enable();
         this.formValue.get('subcat')?.enable();
         this.formValue.get('subtype')?.enable();

         this.formValue.get('action')?.enable();
         this.formValue.get('incident_type')?.enable();
         this.formValue.get('loss_event_type')?.enable();
         this.formValue.get('business_line')?.enable();
         this.formValue.get('business_aria')?.enable();
         this.formValue.get('consequence')?.enable();
         this.formValue.get('risk_level')?.enable();
         this.formValue.get('root_cause')?.enable();
         this.formValue.get('potential_amount')?.enable();
         this.formValue.get('actual_amount')?.enable();
         

         const userId=this.userId;
         const incidentId = this.selectedIncidentId;
         console.log(incidentId);
         const description = this.formValue.value.description;
         const oc_date = this.formValue.value.oc_date;
         const detected_date = this.formValue.value.detected_date;
         const reporting_date = this.formValue.value.reporting_date;
         const risk_owner = this.formValue.value.risk_owner;
         const risk_cause = this.formValue.value.risk_cause;
         const sub_category = this.formValue.value.sub_category;
         const sub_type = this.formValue.value.subtype;

         console.log(sub_type);
         // risk part
        
         const comment = this.formValue.value.comment;
         const IncidentTypeId = this.formValue.value.incident_type;
         const loss_event_typeId = this.formValue.value.loss_event_type;
         const business_lineId= this.formValue.value.business_line;
         const business_ariaId = this.formValue.value.business_aria;
         const risk_dep_status = this.formValue.value.risk_dep_status;
         const consequenceId = this.formValue.value.consequence;
         const risk_levelId = this.formValue.value.risk_level;
         const root_cause = this.formValue.value.root_cause;
         const action_taken = this.formValue.value.action;
         const actual_amount = this.formValue.value.actual_amount;
         const potential_amount = this.formValue.value.potential_amount;
         if(comment == null || !comment ){
           // Display an error message to the user
        alert("fill all")
        
        }else{
         console.log(action_taken);

         const incidentData = {   
           incidentId :incidentId,
           inc_description :description,
           occurence_date : oc_date,
           detected_date : detected_date,
           reporting_date : reporting_date,
           risk_owner :risk_owner,
           risk_cause : risk_cause,
           sub_category : sub_category,
           riskSubTypeId : sub_type,
           updatedBy : this.userId,
           currentLevel:this.currentLevel,
// risk part
           description: comment,
           commentedBy:userId,
           incidentTypeId: IncidentTypeId, 
           loss_event_typeId:loss_event_typeId,
           business_lineId:business_lineId,
           business_ariaId:business_ariaId,
           consequenceId:consequenceId,
           risk_levelId:risk_levelId,
           rootCause:root_cause,
           action:action_taken,
           actual_amount:actual_amount,
           potential_amount:potential_amount,
           riskDepStatusId:risk_dep_status,
         
         };

         console.log('model sent ' + incidentData);
         this.revertIncidentService
           .revertDetails(incidentData)
           .subscribe(
             (res) => {
              this.formValue.reset();
               this.showSuccessMessage = true;
               this.successMessage = res.message;

               setTimeout(() => {
                 this.hideSuccess();
                 // Additional code to execute after the setTimeout
                 
                 this.showform = false;
                 this.showtable = true;
                 this.nav1.select(1);
                 this.getPosts(this.userId,'RE');
               }, 3000);
               this.updateIncidentCount();
             
             },
             (err) => {
              console.log('inside err');
               console.log(err.message);
               this.showSuccessMessage = true;
               this.successMessage = err.message;
               setTimeout(() => {
                 this.hideSuccess();
               }, 3000);
             },
           );
       }
     }


        validateFields(): boolean {
          const fieldsToValidate = [
            'description', 'oc_date', 'detected_date', 'reporting_date', 'risk_owner',
            'risk_cause', 'comment', 'incident_type','subcat','subtype',
            'loss_event_type', 'business_line', 'business_aria', 'consequence',
            'risk_level', 'root_cause', 'action','recovery_action'
          ];

          // 'actual_amount', 'potential_amount','account_number'

          const disabledFields = [];

          for (const field of fieldsToValidate) {
            const formControl = this.formValue.get(field);

            // Check if the field is disabled
            if (formControl && formControl.disabled) {
              // Keep track of the disabled field
              disabledFields.push(field);
            } else {
              const fieldValue = this.formValue.value[field];

              // Check if the field is null, undefined, or falsy
              if (fieldValue == null || !fieldValue ||
                  (typeof fieldValue !== 'string' && fieldValue.toString().trim() === '')) {
                this.showEmtyMessage = true;
                this.emtyMessage = `Please fill in the '${field}' field.`;

                // Disable the temporarily enabled fields
                for (const disabledField of disabledFields) {
                  this.formValue.get(disabledField)?.disable();
                }

                setTimeout(() => {
                  this.showEmtyMessage = false;
                  this.emtyMessage = '';
                }, 3000);

                return false;
              }
            }
          }

          // Disable the temporarily enabled fields before returning
          for (const disabledField of disabledFields) {
            this.formValue.get(disabledField)?.disable();
          }

          return true;
        }


      //   sendBackDetails(row:any) {

      //     if (!this.validateFields()) {
      //       return;
      //     }

      //     console.log(row);
      //     const comment = this.formValue.value.comment;
      //     const incidentId=this.selectedIncidentId;
      //     const userId=this.userId;
      //     // console.log("cmt value : "+comment);
      //     console.log("id value : "+incidentId);

      //     if(comment == null || !comment){
      //       // this.not_filled=true;
          
      //     }else{

      //       const dataToSend = {
      //         description: comment,
      //         incidentId: incidentId,
      //         commentedBy:userId,
      //         currentLevel:this.currentLevel,
              
      //       };

      //       this.riskDepartmentService.sendBackIncident(incidentId,dataToSend).subscribe(
      //         (res) => {
      //           console.log(res);
      //           this.showSuccessMessage = true;
      //           this.successMessage = res.message;
      //           setTimeout(() => {
      //             this.hideSuccess();
      //             this.formValue.reset();
      //             this.showform = false;
      //             this.showtable = true;
      //             this.getPosts(this.userId);
      //           }, 3000);
      //         },
      //         (err) => {
      //           console.log(err.message);
      //           this.showSuccessMessage = true;
      //           this.successMessage = err.message;
      //           this.showform = false;
      //           this.showtable = true;
      //           setTimeout(() => {
      //             this.hideSuccess();
      //           }, 3000);

      //         }
      //       );

      //     }    
        
      //  }

           
      hideSuccess() {
          this.showSuccessMessage = false;
     }

// pagination start here
prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updateDisplayedData();
    console.log('Previous Page:', this.currentPage);
  }
}

nextPage() {
  const totalPages = Math.ceil(this.incidents.length / this.itemsPerPage);
  if (this.currentPage < totalPages) {
    this.currentPage++;
    this.updateDisplayedData();
    console.log('Next Page:', this.currentPage);
  }
}

goToPage(page: number) {
  this.currentPage = page;
  this.updateDisplayedData();
}

updateDisplayedData() {
  if (this.incidents) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedIncidentList = this.incidents.slice(startIndex, endIndex);
  }
}

getPageArray(): number[] {
  if (this.incidents && this.incidents.length > 0) {
    const totalPages = Math.ceil(this.incidents.length / this.itemsPerPage);

    // Only show pages 1 and 2
    return [1, 2].filter(page => page <= totalPages);
  } else {
    return [];
  }
}
// pagination close here 

//  methods to your component class for comment pagination
prevCommentPage() {
  if (this.currentPageComment > 1) {
    this.currentPageComment--;
    this.updateDisplayedCommentData();
    console.log('Previous Comment Page:', this.currentPageComment);
  }
}

nextCommentPage() {
  const totalPages = Math.ceil(this.commentList.length / this.itemsPerPageComment);
  if (this.currentPageComment < totalPages) {
    this.currentPageComment++;
    this.updateDisplayedCommentData();
    console.log('Next Comment Page:', this.currentPageComment);
  }
}

goToCommentPage(page: number) {
  this.currentPageComment = page;
  this.updateDisplayedCommentData();
}

updateDisplayedCommentData() {
  if (this.commentList) {
    const startIndex = (this.currentPageComment - 1) * this.itemsPerPageComment;
    const endIndex = startIndex + this.itemsPerPageComment;
    this.displayedCommentList = this.commentList.slice(startIndex, endIndex);
  }
}

getCommentPageArray(): number[] {
  if (this.commentList && this.commentList.length > 0) {
    const totalPages = Math.ceil(this.commentList.length / this.itemsPerPageComment);

    // Only show pages 1 and 2
    return [1, 2].filter(page => page <= totalPages);
  } else {
    return [];
  }
}





}
