import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

import { AuthService } from 'src/app/login/auth.service';
import { ReportService } from '../report/report.service';
import { UserService } from '../user/user.service';
import { TrackService } from './track.service';
import { CommentModel } from '../view-incident/comment-model';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
 
})

export class TrackComponent {
   // General state variables
   loading: boolean = true;
   showdata: boolean = true;
   showform: boolean = false;
   searchBar: boolean = true;
   showSuccessMessage: boolean = false;
   successMessage: string = ''; 
   not_filled: boolean = false;
   // Pagination variables
   currentPage: number = 1;
   itemsPerPage: number = 5;
   totalPages: number = 0;
   totalItems: number = 0;
 
   // Data variables
   incidents: any[] = [];
   paginatedIncidentList: any[] = [];
   commentList: CommentModel[] = [];
   dataSource = new MatTableDataSource<CommentModel>([]);
   row: any = null;
   // Form and search variables
   formValue: FormGroup;
   searchQuery: string = '';
   selectedIncidentId: any;
 
   // User and document variables
   userId: any;
   empCode: any;
   baseUrl: string;
   docList: any[] = [];
 
   // Navigation and levels
   @ViewChild('nav1', { static: true }) nav1: NgbNav;
   levels: any[] = [];
   current_level: any;
 
   // Status descriptions
   statusDescriptions: { [key: string]: string } = {
     CO: 'Completed',
     RE: 'Revert',
     DE: 'Declined',
     PE: 'Pending'
   };




  
  constructor(private formBuilder: FormBuilder,private authService: AuthService,private reportService:ReportService,private _snackBar: MatSnackBar,  private userService: UserService,
    private trackService:TrackService,
  ) {

    this.formValue = this.formBuilder.group({
      search_by: [''] ,
      searchInput: [''],
      status: [''],
      startDate: [''],
      endDate: [''],
           
    });

  }

  displayedColumns: string[] = ['description', 'commentedDate', 'added_level', 'addedUser'];


  private paginator: MatPaginator;
  private sort: MatSort;

 @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
      this.dataSource.paginator = paginator;
     }


  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.paginator && this.sort) {
      this.applyFilter('');
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
}

  ngOnInit(){
    this.userId = this.authService.getId();
    this.empCode = this.authService.getempCode();
    this.baseUrl=this.authService.getResourceUrl();
    console.log("this.baseUrl : "+ this.baseUrl);
    this.getLevels();
    this.getPosts() ;
    console.log("user id : "+ this.userId);
    this.current_level = this.authService.getLevel();
    this.dataSource.data = this.commentList;

    this.incidents = this.incidents; // Example function to fetch data
    this.totalPages = Math.ceil(this.incidents.length / this.itemsPerPage);
    this.updatePaginatedList();
  }


  generatePDF(): void {

    const elementsToHide = document.querySelectorAll('.hide-on-print');
    elementsToHide.forEach((el) => el.classList.add('hidden'));

    const element = document.getElementById('details-container');
    if (!element) return;
  
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20; // 10mm margin each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const margin = 10;
  
      let heightLeft = imgHeight;
      let renderedHeight = 0;
      let pageNum = 1;
      const totalPages = Math.ceil(imgHeight / (pageHeight - 20));
  
      // Create a temporary canvas to crop each page
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d')!;
      const pageCanvasHeight = Math.floor((canvas.width / imgWidth) * (pageHeight - 20));
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageCanvasHeight;
  
      while (heightLeft > 0) {
        pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0, renderedHeight,
          canvas.width, pageCanvasHeight,
          0, 0,
          canvas.width, pageCanvasHeight
        );
        const pageImgData = pageCanvas.toDataURL('image/png');
        if (pageNum > 1) pdf.addPage();
  
        let y = 10;
        if (pageNum === 1) {
          // Title
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Incident Details Report', pageWidth / 2, y + 5, { align: 'center' });
  
          // Date
          const currentDate = new Date().toLocaleDateString();
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Generated on: ${currentDate}`, pageWidth / 2, y + 12, { align: 'center' });
  
          // Line
          pdf.setLineWidth(0.5);
          pdf.line(margin, y + 15, pageWidth - margin, y + 15);
  
          y += 20; // Leave space for title/date/line
        }
  
        pdf.addImage(pageImgData, 'PNG', margin, y, imgWidth, pageHeight - y - 10);
  
        // Footer
        pdf.setFontSize(10);
        pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
  
        renderedHeight += pageCanvasHeight;
        heightLeft -= (pageHeight - 20);
        pageNum++;
      }
  
      pdf.save('Incident_Details_Report.pdf');
      elementsToHide.forEach((el) => el.classList.remove('hidden'));
    });
  }


  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    // Sort incidents in descending order by `incidentId`
    this.paginatedIncidentList = this.incidents
      .sort((a, b) => b.incidentId - a.incidentId)
      .slice(startIndex, endIndex);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedList();
  }
  ngAfterViewInit() {
    // Link the paginator and sort to the dataSource
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

 

  updateDisplayedData() {
    if (this.incidents) {
      const filteredIncidents = this.incidents.filter(incident =>
        incident.incident_ref.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        incident.incidentId.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      );
  
      this.totalPages = Math.ceil(filteredIncidents.length / this.itemsPerPage);
  
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
  
      this.paginatedIncidentList = filteredIncidents.slice(startIndex, endIndex);
    }
  }
  

  getLevels() {
    this.userService.getBranches().subscribe((data: any) => {
      this.levels = data.usertypeList;
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
      'Ref': row.incident_ref,
      'Description': row.inc_description,
      'Occurrence Date': this.formatDate(row.occurence_date),
      'Detected Date': this.formatDate(row.detected_date),
      'Responsible Person': row.risk_owner,
      'Risk Cause Description': row.sub_type.riskCause.description,
      'Risk Sub Category ': row.sub_type.riskSubCategory.description,
      'Risk Sub Type ': row.sub_type.description,
      'Root Cause & Recovery Actions':row.recovery_action,
      'Reporting Officer ': row.reporting_officer,
      'Contact Number ': row.contact_number,
      'Incident Type': row.incidentType ? row.incidentType.description : 'N/A',
      'Action Taken By the Department': row.action,
      'Loss Event Type': row.lossEventType?.description || 'N/A',
      'Business Line': row.businessLine?.description || 'N/A',
      'Business Aria': row.businessAria?.description || 'N/A',
      'Consequences of incident': row.consequence?.description || 'N/A',
      'Root cause Analysis By the Risk Department': row.rootCause,
      'Potential Loss Amount': row.potential_amount,
      'Actual Amount': row.actual_amount,
      'Risk Level': row.riskLevel?.description || 'N/A',
      'Status ': this.getStatusDescription(row.status)|| 'N/A',
      'Branch ': row.branch?.description || 'N/A',
      'Region ': row.region?.description || 'N/A',
      'Department':row.department?.description || 'N/A',
      'Current-Level':row.currentLevel|| 'N/A',
     
    };

  });

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Incidents');
  XLSX.writeFile(wb, 'incidents.xlsx');
}


  getPosts() {

    this.loading = true; 
    const status = this.formValue.get('search_by').value || null;
    const startDate = this.formValue.get('startDate').value || null;
    const endDate = this.formValue.get('endDate').value || null;
    const incidentData = {    
      status:status,
      userId:this.userId,
      employeeCode:this.empCode,
      startDate:startDate,
      endDate:endDate
    };
   
    this.trackService.getPosts(incidentData)
      .subscribe((data: any) => {
        if (data.code == 200) {
           console.log(data);
           this.loading=false;
          this.incidents = data.incidentDtoList;
          const incidentCount = this.incidents?.length;
          this.totalItems = this.incidents?.length;
          console.log('Incident Count:', incidentCount);
          this.updateDisplayedData();
          this.updatePaginatedList();
       }else{
        console.log('Error fetching data:', data.message);
       }
       this.loading=false;
   },
   (error) => {
     console.error('Error fetching data:', error);
     this.loading = false; // Hide loading GIF even if there is an error
   }
 );

  
}



onView(row: any) {
  this.row = row;
  this.searchBar = false;

    this.commentList = row.comments || []; 
    this.dataSource.data = this.commentList; 
  // Ensure row and documents exist before accessing them
  if (row.documents && Array.isArray(row.documents)) {
    this.docList = this.row.documents;
  } else {
    console.error('this.row.documents is undefined or not an array');
    this.docList = [];
  }

  this.selectedIncidentId = row.incidentId;
  console.log(this.selectedIncidentId);

  // Reset the comment list before pushing new ones
  this.commentList = [];

  // Filter comments based on the selected incident
  this.incidents.forEach((incident) => {
    if (incident.comments) {
      incident.comments.forEach((comment) => {
        if (incident.incidentId == this.selectedIncidentId) {
          this.commentList.push(comment);
        }
      });
    }
  });

  console.log(this.commentList);

  // Update dataSource with the filtered comment list
  this.dataSource.data = this.commentList;

  // Ensure paginator and sort are correctly updated
  if (this.paginator && this.sort) {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Move to the next tab and show the form
  this.moveToNextTab();
  this.showdata = false;
  this.showform = true;
}




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
    this.searchBar=true;
  }
 


   viewFile(event: Event) {

    console.log("Inside viewFile method", event);

    const target = event.target as HTMLSelectElement;
    const docPath = target.value;

    if (docPath !== "se") {
        let basePath = this.baseUrl;  // Assuming this.baseUrl is 'http://10.100.57.133:84'
        console.log("Original docPath:", docPath);

        // Strip off the local drive letter and convert backslashes to forward slashes
        let formattedPath = docPath.replace(/^E:[/\\]+/, "").replace(/\\/g, "/");

        // Construct the full URL path correctly, ensuring no redundant 'docs' part
        let fullPath = `${basePath}${formattedPath}`;

        console.log("Opening file at:", fullPath);
        window.open(fullPath, "_blank");
    }

  }

  
    // pagination start here
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateDisplayedData();
      }
    }
  
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updateDisplayedData();
      }
    }
  
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updateDisplayedData();
      }
    }



  getPageArray(): number[] {
    if (this.incidents && this.incidents.length > 0) {
      const totalPages = Math.ceil(this.incidents.length / this.itemsPerPage);
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    } else {
      return [];
    }
  }

  

}
