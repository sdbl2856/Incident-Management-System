import { Component, Input, ViewChild } from '@angular/core';
import { RiskDepartmentService } from './risk-department.service';
import { AuthService } from 'src/app/login/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { IncidentModel } from '../incident/incident-model';
import { RevertIncidentService } from '../revert-incident/revert-incident.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-risk-department',
  templateUrl: './risk-department.component.html',
  styleUrls: ['./risk-department.component.scss']
})
export class RiskDepartmentComponent {

  @ViewChild('nav1', { static: true }) nav1: NgbNav;

  row:any;
  userId:any;
  commentList:any[];
  incidents:any[];
  selectedIncidentId:any;
  currentLevel:any;
  showdata = true; 
  showform=false; 
  formValue: FormGroup; 
  comment:any; 
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  showEmtyMessage: boolean = false;
  emtyMessage: string = '';
  not_filled=false;
  consequenceList: any[];
  statusList: any[];
  riskLevelList: any[];
  businessAriaList: any[];
  businessLineList: any[];
  lossEventTypeList: any[];
  incidentTypeList: any[];
  specifictypes=[];
  specificSubTypes= [];
  selectedStatus:string;
  next_level:any;
  incidentmodel_obj: IncidentModel = new IncidentModel();

  ro_data=false;
  form_fill=true;
  form_decide=false;
  status_fill=false;
  drop_down=true;
  export_btn=false;

   // New properties for pagination
   currentPage: number = 1;
   itemsPerPage: number = 5; 
   displayedIncidentList: any[] = [];

   currentPageComment: number = 1;
   itemsPerPageComment: number = 5; // or any desired number
   displayedCommentList: any[] = [];

   isIncidentCompleted = false;

  constructor(private formBuilder: FormBuilder,private riskDepartmentService:RiskDepartmentService,private authService: AuthService,private revertIncidentService:RevertIncidentService ){
    this.formValue = this.formBuilder.group({
      comment: ['', Validators.required], 
      action_taken: [''],
      incident_type: ['0'],
      loss_event_type: ['0'],
      business_line: ['0'],
      business_aria: ['0'],
      consequence: ['0'],
      risk_level: ['0'],
      status: ['PE'],
      root_cause: [''],
      actual_amount:['', Validators.required],
      potential_amount:['', Validators.required],
      risk_status: [''],
      recovery_action: ['null'],
      recoverd_amount: ['0'],
      account_number: ['0'],
    });

   
   
  }

  ngOnInit(){

    this.userId = this.authService.getId();
    this.currentLevel = this.authService.getLevel();
    if(this.currentLevel=="ORM" ){
      this.ro_data=true;
      this.form_fill=false;
      this.form_decide=false;
      this.status_fill=true;
      this.export_btn=true;
      
    }else if(this.currentLevel=="BM"){
      this.form_fill=false;
      this.form_decide=true;
      
      // this.ro_data=false;
    }
    else if(this.currentLevel=="RO"){
      this.ro_data=false;
      this.form_fill=true;
      this.form_decide=false;
      this.status_fill=false;
    }  else if(this.currentLevel=="RM"){
      this.ro_data=false;
      this.form_fill=false;
      this.form_decide=true;
      this.status_fill=false;
    }else if(this.currentLevel=="RC"){
      this.ro_data=false;
      this.form_fill=false;
      this.form_decide=true;
      this.status_fill=false;
    }else if(this.currentLevel=="DRC"){
      this.ro_data=false;
      this.form_fill=false;
      this.form_decide=true;
      this.status_fill=false;
    }else if(this.currentLevel=="RRC"){
      this.ro_data=false;
      this.form_fill=false;
      this.form_decide=true;
      this.status_fill=false;
    }
    // this.getPosts(this.userId,'PE');
    this.getTypes();
   
    
    this.getPosts(this.userId, 'PE');
    

  

  }

  onChangeStatus() {
     this.selectedStatus = this.formValue.value.status;
  
    if (this.userId ) {
      this.getPosts(this.userId, this.selectedStatus);
    
    } else {
      console.error('userId is undefined');
    }
  }

  getPosts(userId: any, selectedStatus: string | undefined = undefined) {
    if (this.userId) {
      console.log("selected incident ID :" + this.selectedIncidentId);
  
      this.riskDepartmentService.getPosts(this.userId, selectedStatus)
        .subscribe((data: any) => {
          if (data.code === 200) {
            this.commentList = [];
            console.log(data);
  
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
          const incidentCount = this.incidents.length;
          console.log('Incident Count:', incidentCount);
  
          // Check if any incident is completed
          this.isIncidentCompleted = this.incidents.some(incident => incident.status === 'CO');
  
          this.updateDisplayedData();
        });
  
    } else {
      console.error('userId is undefined');
    }
  }
  
  statusDescriptions: { [key: string]: string } = {
    'CO': 'Completed',
    'RE': 'Revert',
    'DE': 'Declined',
    'PE': 'Pending'
  };

  onView(row:any){
     console.log(row);
    this.selectedIncidentId = row.incidentId;
    this.getPosts(this.userId, this.selectedStatus);
    this.moveToNextTab();
    this.row = row;
    this.showdata = false;
    this.showform = true;
    this.drop_down=false;

     // risk part 
     this.formValue.controls['action_taken'].setValue(row.action);
     this.formValue.controls['incident_type'].setValue(row.incidentType?.incidentTypeId);
     this.formValue.controls['loss_event_type'].setValue(row.lossEventType?.lossEventTypeId);
     this.formValue.controls['business_line'].setValue(row.businessLine?.businessLineId);
     this.formValue.controls['business_aria'].setValue(row.businessAria?.businessAriaId);
     this.formValue.controls['consequence'].setValue(row.consequence?.consequenceId);
     this.formValue.controls['risk_level'].setValue(row.riskLevel?.riskLevelId);
     this.formValue.controls['root_cause'].setValue(row.rootCause);
     this.formValue.controls['potential_amount'].setValue(row.potential_amount);
     this.formValue.controls['actual_amount'].setValue(row.actual_amount);
     this.formValue.controls['risk_status'].setValue(row.status);
     
     this.formValue.controls['account_number'].setValue(row.account_number);
     this.formValue.controls['recoverd_amount'].setValue(row.recoverd_amount);
     this.formValue.controls['recovery_action'].setValue(row.recovery_action);
     
     

  }

  clickTab1(){
    this.nav1.select(1);
    this.showdata = true;  
    this.showform = false;
    this.drop_down=true;
   
    // Reset comment form
    this.formValue.reset();
    
  }

  moveToNextTab() {
    const currentActiveTab = this.nav1.activeId;
    if (currentActiveTab < 2) {
      this.nav1.select(currentActiveTab + 1); 
    }

   
  }

   hideSuccess() {
        this.showSuccessMessage = false;
    }

    getTypes(){

          this.riskDepartmentService.getTypes().subscribe((data: any) => { 
            console.log(data) ;
          this.consequenceList = data.consequenceList;
          this.statusList = data.statusList;
          this.riskLevelList = data.riskLevelList;
          this.businessAriaList = data.businessAriaList;
          this.businessLineList = data.businessLineList;
          this.lossEventTypeList = data.lossEventTypeList;
          this.incidentTypeList = data.incidentTypeList;
          
        });
    }
  
    sendBackDetails(row) {

            console.log("inside send-back");
         const description = row.inc_description;
         const detected_date = row.detected_date;
         const reporting_date = row.reporting_date;
         const occurance_date = row.occurence_date;
         const risk_owner = row.risk_owner;
         const risk_cause = row.risk_cause;
         const sub_category = row.sub_category;
         const riskSubTypeId = row.sub_type.riskSubTypeId;
         console.log(riskSubTypeId);
        //  console.log(sub_type);
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
         const action_taken = this.formValue.value.action_taken;
        
         const actual_amount = this.formValue.value.actual_amount;
         const potential_amount = this.formValue.value.potential_amount;
         const incidentId=row.incidentId
         const userId=this.userId;
      // console.log("Occurance Date : "+oc_date);
      // console.log("id value : "+incidentId);

      if(comment == null || !comment){
         // Display an error message to the user
        this.showEmtyMessage = true;
        this.emtyMessage = 'Please fill in all required fields.';

        // Hide the error message after 3 seconds
        setTimeout(() => {
          this.showEmtyMessage = false;
          this.emtyMessage = '';
        }, 3000);
        return;
                
      }else{
        const dataToSend = {

          incidentId: incidentId,
          currentLevel:this.currentLevel, 
          inc_description :description,
          detected_date : detected_date,
          reporting_date : reporting_date,
          occurence_date  :occurance_date,
          risk_owner :risk_owner,
          risk_cause : risk_cause,
          sub_category : sub_category,
          // sub_type : { riskSubTypeId: sub_type },
          riskSubTypeId : riskSubTypeId,
          updatedBy : this.userId,
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
        this.riskDepartmentService.revertDetails(dataToSend).subscribe(
          (res) => {
            console.log(res);
            this.showSuccessMessage = true;
            this.successMessage = res.message;
            setTimeout(() => {
              this.hideSuccess();
              this.formValue.reset();
              this.showdata = true;  
              this.showform = false;
              this.nav1.select(1);
              this.getPosts(this.userId, this.selectedStatus);
              this.drop_down=true;
              this.formValue.controls['status'].setValue(this.row.status);
            }, 3000);  
          },
          (err) => {
            console.log(err.message);

            this.showSuccessMessage = true;
            this.successMessage = err.message;
            setTimeout(() => {
              this.hideSuccess();
            }, 3000);

          }
        );

      }      
   }

  // by RO
    updateIncidents() {
      console.log("inside ro update");
     
      if (this.currentLevel == 'RC') {
        this.next_level = 'BM';
      }
      if (this.currentLevel == 'BM') {
        this.next_level = 'RO';
      }
      if (this.currentLevel == 'RM') {
        this.next_level = 'RO';
      }
      if (this.currentLevel == 'RO') {
        this.next_level = 'ORM';
      }
      if (this.currentLevel == 'RRC') {
        this.next_level = 'RM';
      }
      if (this.currentLevel == 'DRC') {
        this.next_level = 'RO';
      }

      const userId=this.userId;
      const incidentId = this.selectedIncidentId;
      const comment = this.formValue.value.comment;
      const IncidentTypeId = this.formValue.value.incident_type;
      const loss_event_typeId = this.formValue.value.loss_event_type;
      const business_lineId= this.formValue.value.business_line;
      const business_ariaId = this.formValue.value.business_aria;
      const risk_dep_status = this.formValue.value.risk_dep_status;
      const consequenceId = this.formValue.value.consequence;
      const risk_levelId = this.formValue.value.risk_level;
      const root_cause = this.formValue.value.root_cause;
      const action_taken = this.formValue.value.action_taken;
      const actual_amount = this.formValue.value.actual_amount;
      const potential_amount = this.formValue.value.potential_amount;
      console.log(action_taken);
      // Check for null or empty values
  if (
    !comment ||
    !IncidentTypeId ||
    !loss_event_typeId  ||
    !business_lineId ||
    !business_ariaId ||
    !consequenceId ||
    !risk_levelId ||
    !root_cause||
    !action_taken 

  ){
    
   // Display an error message to the user
   this.showEmtyMessage = true;
   this.emtyMessage = 'Please fill in all required fields.';

   // Hide the error message after 3 seconds
   setTimeout(() => {
     this.showEmtyMessage = false;
     this.emtyMessage = '';
   }, 3000);
   return;
  }
      
  // console.log('IncidentTypeId ' + IncidentTypeId);
      const incidentData = {
        incidentId: incidentId,
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
        current_level:this.next_level,

      };
     
      // console.log('model sent ' + incidentData);
      this.riskDepartmentService
        .updateIncidents(incidentId,incidentData)
        .subscribe(
          (res) => {  
           this.showSuccessMessage = true;
          // Store the success message from the backend
           this.successMessage = res.message;
            setTimeout(() => {
              this.hideSuccess();
                // Additional code to execute after the setTimeout
              this.formValue.reset();
              this.showdata = true;
              this.showform = false;
              this.nav1.select(1);
              this.getPosts(this.userId, this.selectedStatus);
              this.drop_down=true;
              this.formValue.controls['status'].setValue(this.row.status);
              }, 3000);  
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

//  by orm
  updateStatus(){

      console.log('inside update Status');
      const userId=this.userId;
      const incidentId = this.selectedIncidentId;
      const comment = this.formValue.value.comment;
      const risk_status = this.formValue.value.risk_status;
                  // Check for null or empty values
  if(comment === null || comment.trim() === '' || risk_status=='') {  
    // Display an error message to the user
    this.showEmtyMessage = true;
    this.emtyMessage = 'Please fill in all required fields.';
    // Hide the error message after 3 seconds
    setTimeout(() => {
      this.showEmtyMessage = false;
      this.emtyMessage = '';
    }, 3000);
    return;
   }     
    const incidentData = {
         incidentId: incidentId,
         description: comment,
         commentedBy:userId,
         risk_status:risk_status,
         current_level:this.next_level,
     };  
       this.riskDepartmentService
         .updateStatus(incidentId,incidentData)
         .subscribe(
           (res) => {  
            this.showSuccessMessage = true;
           // Store the success message from the backend
            this.successMessage = res.message;
             setTimeout(() => {
               this.hideSuccess();
             // Additional code to execute after the setTimeout
               this.formValue.reset();
               this.showdata = true;
               this.showform = false;
               this.nav1.select(1);
               this.getPosts(this.userId, this.selectedStatus);
               this.drop_down=true;
               this.formValue.controls['status'].setValue(this.row.status);
               }, 3000);  
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

  forward(row) {


    const comment = this.formValue.value.comment;
    const incidentId=row.incidentId
    const userId=this.userId;

    if(this.currentLevel =="RC"){
      this.next_level="BM";
    }
    if(this.currentLevel =="BM"){
      this.next_level="RO";
    }
    if(this.currentLevel =="RM"){
      this.next_level="RO";
    } if(this.currentLevel =="RO"){
      this.next_level="ORM";
    }if(this.currentLevel =="DRC"){
      this.next_level="RO";
    }if(this.currentLevel =="RRC"){
      this.next_level="RM";
    }
    // console.log("cmt value : "+comment);
    // console.log("id value : "+incidentId);
if(comment == null || !comment){
   
      // this.not_filled=true;
    }else{

      const dataToSend = {
        description: comment,
        incidentId: incidentId,
        commentedBy:userId,
        next_level:this.next_level,
        current_level:this.currentLevel,
        userId:this.userId
      };
      console.log(this.userId);
      this.riskDepartmentService.forwardIncident(incidentId,dataToSend).subscribe(
        (res) => {
          // console.log(res);
          this.formValue.reset();
          this.showSuccessMessage = true;
          this.successMessage = res.message;
          setTimeout(() => {
            this.hideSuccess();
         
            this.showdata = true;
            this.showform = false;
            this.nav1.select(1);
            this.getPosts(this.userId);
          }, 3000);

        },
        (err) => {
          alert(err.message);
          this.showSuccessMessage = true;
          this.successMessage = err.message;
          setTimeout(() => {
            this.hideSuccess();
          }, 3000);
        }
      );

    }    
  
}
  
  sendBack(row) {
      
    const comment = this.formValue.value.comment;
    const incidentId=row.incidentId
    const userId=this.userId;
   

    if(comment == null || !comment){
      // this.not_filled=true;
     
    }else{

      const dataToSend = {
        description: comment,
        incidentId: incidentId,
        commentedBy:userId,
        logLevel:this.currentLevel
        
      };

      this.riskDepartmentService.sendBackIncident(incidentId,dataToSend).subscribe(
        (res) => {
          console.log(res);

          this.showSuccessMessage = true;
          this.successMessage = res.message;
          setTimeout(() => {
            this.hideSuccess();
            this.formValue.reset();
            this.showdata = true;  
            this.showform = false;
            this.nav1.select(1);
            this.getPosts(this.userId);
          }, 3000);

        
        },
        (err) => {
          console.log(err.message);

          this.showSuccessMessage = true;
          this.successMessage = err.message;
          setTimeout(() => {
            this.hideSuccess();
          }, 3000);

        }
      );

    }    
  
}
    exportToExcel() {
      const data = this.incidents.map(row => {
        return {
          'Id': row.incidentId || '',
          'Description': row.inc_description || '',
          'Occurrence Date': this.formatDate(row.occurence_date) || '',
          'Detected Date': this.formatDate(row.detected_date) || '',
          'Risk Owner': row.risk_owner || '',
          'Risk Cause Description': (row.sub_type && row.sub_type.riskCause && row.sub_type.riskCause.description) || '',
          'Risk Sub Category': (row.sub_type && row.sub_type.riskSubCategory && row.sub_type.riskSubCategory.description) || '',
          'Risk Sub Type': (row.sub_type && row.sub_type.description) || '',
          'Reporting Officer': row.reporting_officer || '',
          'Contact Number': row.contact_number || '',
          'Incident Type': (row.incidentType && row.incidentType.description) || '',
          'Action Taken By the Department': row.action || '',
          'Loss Event Type': (row.lossEventType && row.lossEventType.description) || '',
          'Business Line': (row.businessLine && row.businessLine.description) || '',
          'Business Aria': (row.businessAria && row.businessAria.description) || '',
          'Consequences of incident': (row.consequence && row.consequence.description) || '',
          'Root cause analysis': row.rootCause || '',
          'Potential Loss Amount': row.potential_amount || '',
          'Actual Amount': row.actual_amount || '',
          'Risk Level': (row.riskLevel && row.riskLevel.description) || '',
          'Status': row.status || '',
          'Branch': (row.branch && row.branch.description) || '',
          'Region': (row.region && row.region.description) || '',
          'Deparmtnt': (row.department && row.department.description) || ''
        };
      });
    
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Incidents');
      XLSX.writeFile(wb, 'incidents.xlsx');
    }
    
    private formatDate(date: any): string {
      // You can implement your own date formatting logic here
      return date ? new Date(date).toLocaleDateString() : '';
    }

  // pagination start here
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.incidents.length / this.itemsPerPage);
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

// Methods for comment pagination
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

    // Generate an array with page numbers up to totalPages
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  } else {
    return [];
  }
}

    
}
