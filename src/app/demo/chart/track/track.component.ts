import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommentModel } from '../view-incident/comment-model';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/login/auth.service';
import { ReportService } from '../report/report.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UserService } from '../user/user.service';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';




@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent {
  editorData: string = '';
  formValue: FormGroup;   
  selectedOption: string = ''; 
  showdata = true;  
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
  search_ref_div=false;
  search_box=false;
  status_dropdown=false;
  empCode:any;

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
      search_by: ['PE'] ,
      searchInput: [''],
      status: [''],
      level: [''],
      startDate: [''],
      endDate: [''],
           
    });

  }

  displayedColumns: string[] = ['description', 'commentedDate'];
  dataSource = new MatTableDataSource<Comment>([]); // Replace `Comment` with your data model

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  

  ngOnInit(){
  
 
    this.userId = this.authService.getId();
    this.empCode = this.authService.getempCode();
    this.getLevels();
    this. getPosts() ;
    console.log("user id : "+ this.userId);
    this.current_level = this.authService.getLevel();
  }

  getLevels() {
    this.userService.getBranches().subscribe((data: any) => {
    
      this.levels = data.usertypeList;
      // this.specificBranches = this.branches;

      // console.log(this.branches);
      // console.log(this.regions);
      // console.log(this.user_types);
    });
  }


  onSearchTypeChange() {
    this.nav1.select(1);
    this.showdata = true;
    this.showform = false;
  
    const selectedSearchType = this.formValue.get('search_by').value;
 
    console.log(selectedSearchType);
    // Reset incidents array and update displayed data
    this.incidents = [];
    this.updateDisplayedData();
  
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


  getPosts() {

    const selectedSearchType = this.formValue.get('search_by').value;

    const incidentData = {    
      status:selectedSearchType,
      userId:this.userId,
      employeeCode:this.empCode
    };

    console.log(incidentData);
    this.reportService.getPosts(incidentData)
      .subscribe((data: any) => {
        if (data.code === 200) {

          console.log(data);
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
        const incidentCount = this.incidents?.length;
        console.log('Incident Count:', incidentCount);
  
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
      console.log(this.displayedIncidentList);
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
