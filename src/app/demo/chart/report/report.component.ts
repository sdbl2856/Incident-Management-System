import { Component, ViewChild } from '@angular/core';
import { CommentModel } from '../view-incident/comment-model';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/login/auth.service';
import { ReportService } from './report.service';
import * as XLSX from 'xlsx';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UserService } from '../user/user.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})

export class ReportComponent {

  formValue: FormGroup;   
  selectedOption: string = ''; 
  showdata = false;  
  row : any ;
  incidents:any[];
  formGroup: FormGroup;
  showform: boolean = false;
  userId:any;
  not_filled=false;
  comment:any;
  selectedIncidentId:any;
  commentList:any[];
  next_level:any;
  preLevel:any; 
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  Commentmodel_obj:CommentModel = new CommentModel();
  levels: any[];
  departmentList: any[];
  branchList: any[];
  search_ref_div=false;
  search_box=false;
  status_dropdown=false;
  incidentCount:number;

    // New properties for pagination
    currentPage: number = 1;
    itemsPerPage: number = 5; 
    displayedIncidentList: any[] = [];

    // Initialize currentPageComment and itemsPerPageComment
currentPageComment: number = 1;
itemsPerPageComment: number = 5; // or any desired number
displayedCommentList: any[] = [];
  
  

  @ViewChild('nav1', { static: true }) nav1: NgbNav;

  current_level : any ;
  

  constructor(private formBuilder: FormBuilder,private authService: AuthService,private reportService:ReportService,private _snackBar: MatSnackBar,  private userService: UserService,) {

    this.formValue = this.formBuilder.group({
      search_by: [''],
      searchInput: [''],
      status: [''],
      level: [''],
      startDate: [''],
      endDate: [''],
           
    });

  }

  ngOnInit(){
    this.getLevels();
    this.userId = this.authService.getId();
    this.current_level = this.authService.getLevel();
  }

  getLevels() {

    
    this.userService.getBranches().subscribe((data: any) => {
    
      this.levels = data.usertypeList;
      this.departmentList = data.departmentList;
      console.log(this.departmentList);
      this.branchList = data.branchList;
      
      // this.specificBranches = this.branches;

      // console.log(this.branches);
      // console.log(this.regions);
      // console.log(this.user_types);
    });
  }


  onSearchTypeChange() {

    console.log("inside onSearchTypeChange");
    this.nav1.select(1);
    this.showdata = true;
    this.showform = false;
  
    const selectedSearchType = this.formValue.get('search_by').value;
    if (this.search_ref_div = selectedSearchType == 'REF') {
      this.search_ref_div = true;
      this.search_box = true;
      this.status_dropdown = false;
    } else if (this.search_ref_div = selectedSearchType == 'LEVEL') {
      this.search_ref_div = true;
      this.status_dropdown = true;
      this.search_box = false;
    }
  
    // Reset incidents array and update displayed data
    this.incidents = [];
    this.updateDisplayedData();
  
    // Reset specific form controls
    this.formValue.get('searchInput').setValue('');
    this.formValue.get('status').setValue('');
    this.formValue.get('level').setValue('');
    this.formValue.get('startDate').setValue('');
    this.formValue.get('endDate').setValue('');
  }
  
private formatDate(date: any): string {
  // You can implement your own date formatting logic here
  return date ? new Date(date).toLocaleDateString() : '';
}
exportToExcel() {
  const data = this.incidents.map(row => {
    return {
      'Id': row.incidentId,
      'Description': row.inc_description,
      'Occurrence Date': this.formatDate(row.occurence_date),
      'Detected Date': this.formatDate(row.detected_date),
      'Risk Owner': row.risk_owner,
      'Risk Cause Description': row.sub_type.riskCause.description,
      'Risk Sub Category ': row.sub_type.riskSubCategory.description,
      'Risk Sub Type ': row.sub_type.description,
      'Reporting Officer ': row.reporting_officer,
      'Contact Number ': row.contact_number,
      'Incident Type': row.incidentType ? row.incidentType.description : 'N/A',

      'Action Taken By the Department': row.action,
      'Loss Event Type': row.lossEventType?.description || 'N/A',
      'Business Line': row.businessLine?.description || 'N/A',
      'Business Aria': row.businessAria?.description || 'N/A',
      'Consequences of incident': row.consequence?.description || 'N/A',
      'Root cause analysis': row.rootCause,
      'Potential Loss Amount': row.potential_amount,
      'Actual Amount': row.actual_amount,
      'Risk Level': row.riskLevel?.description || 'N/A',
      'Status ': row.status || 'N/A',
      'Branch ': row.branch?.description || 'N/A',
      'Region ': row.region?.description || 'N/A',
      
    };
  });

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Incidents');
  XLSX.writeFile(wb, 'incidents.xlsx');
}



    getBranches(){

      
    }

  getPosts() {

    let formattedStartDate="";
    let formattedEndDate ="";
    
    console.log("inside get posts");

    console.log('Selected Incident ID:', this.selectedIncidentId);
    const searchInputValue = this.formValue.get('searchInput').value;
    console.log("ref Id :  "+searchInputValue);
    const statusInputValue = this.formValue.get('status').value;
    const levelInputValue = this.formValue.get('level').value;
    const startDateString = this.formValue.get('startDate').value;
    const endDateString = this.formValue.get('endDate').value;

  

    if (!(searchInputValue || (statusInputValue && levelInputValue && startDateString && endDateString))) {
      // Show a toast message with a larger width
      const config = new MatSnackBarConfig();
      config.duration = 5000; // Set the duration for the toast message
      config.panelClass = ['larger-width-snackbar']; // Add a custom class for styling
  
      this._snackBar.open('Please fill in either the search input or all of the other required fields', 'Close', config);
  
      return;
    }
    
    console.log("startDateString :  "+startDateString);
    console.log("endDateString :  "+endDateString);

   // Check if searchInputValue is falsy, then proceed with date-related operations
   if (!searchInputValue) {
    // Convert the strings to Date objects
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    // Check if the conversion is successful
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      // Handle the error, e.g., show a toast message or log an error
      console.error('Invalid date format. Please provide a valid date.');
      return;
    }

    console.log("after Nan");
    // Format the dates with the desired times
   formattedStartDate = startDate.toISOString().split('T')[0] + ' 00:00:00.000';
   formattedEndDate = endDate.toISOString().split('T')[0] + ' 11:59:59.999';

    // Use the formatted dates in your logic
    console.log('formattedStartDate :', formattedStartDate);
    console.log('formattedEndDate :', formattedEndDate);
  }

const incidentData = {   
  refId: searchInputValue,
  status: statusInputValue,
  level: levelInputValue,
  startDate: formattedStartDate,
  endDate: formattedEndDate,
  userId :this.userId
};

    
    console.log(incidentData);
    this.reportService.getPosts(incidentData)
      .subscribe((data: any) => {
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
  
        // Check if any incident is completed
        // this.isIncidentCompleted = this.incidents.some(incident => incident.status === 'CO');
  
        this.updateDisplayedData();
      });
  }




  statusDescriptions: { [key: string]: string } = {
    'CO': 'Completed',
    'RE': 'Revert',
    'DE': 'Declined',
    'PE': 'Pending'
  };

  
  getStatusDescription(status: string): string {
    return this.statusDescriptions[status];
  }

  
  hideSuccess() {
    this.showSuccessMessage = false;
  }

  moveToNextTab() {
    const currentActiveTab = this.nav1.activeId;
    if (currentActiveTab < 2) {
      this.nav1.select(currentActiveTab + 1); 
    }
   
  }

  clickCancel(){
    this.showdata = true;  
    this.showform = false;
    this.nav1.select(1);
  }

  clickTab1() {
    this.showdata = true;
    this.showform = false;
    this.nav1.select(1);
  
    // Reset comment form
    // this.formValue.reset();
  
    // Clear comment list
    // this.commentList = [];
  }
 
 onView(row:any){
      
      console.log(row);
      this.selectedIncidentId = row.incidentId;
      console.log(this.selectedIncidentId);
      this.getPosts();
      this.moveToNextTab();
      this.row = row;
      this.showdata = false;
      this.showform = true;
      // this.formValue.controls['level'].setValue(row.currentLevel);
      // this.formValue.controls['status'].setValue(row.status);
      // this.formValue.controls['startDate'].setValue(row.actual_amount);
      // this.formValue.controls['endDate'].setValue(row.status)
 
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
    console.log('Incidents:', this.incidents);
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

    // Show only two pages around the current page
    const startPage = Math.max(1, this.currentPageComment - 1);
    const endPage = Math.min(totalPages, startPage + 1);

    // Generate an array with page numbers between startPage and endPage
    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  } else {
    return [];
  }
}




   
 

}


