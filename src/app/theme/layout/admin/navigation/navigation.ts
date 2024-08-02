import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/login/auth.service';
export interface NavigationItem  {

  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
  get?(): NavigationItem[]; // Make this optional with the '?'
}

export interface Navigation extends NavigationItem {
  
  children?: NavigationItem[];
}


const NavigationItems: Navigation[] = [
  {
    id: 'navigation',
    title: '',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      // {
      //   id: 'dashboard',
      //   title: 'Dashboard',
      //   type: 'item',
      //   url: 'dashboard',
      //   icon: 'feather icon-home',
      //   classes: 'nav-item',
      // },
    
    ],
  },


  {
    id: 'chart-maps',
    title: 'Incidents',
    type: 'group',
    icon: 'icon-charts',
    children: [
    
      {
        id: 'incident',
        title: 'New Incident',
        type: 'item',
        url: 'incident',
        classes: 'nav-item',
        icon: 'feather icon-home',
      },
      {
        id: 'revert-incident',
        title: 'Revert Incident',
        type: 'item',
        url: 'revert-incident',
        classes: 'nav-item',
        icon: 'feather icon-file-text',
      },
      {
        id: 'report',
        title: 'Reports',
        type: 'item',
        url: 'report',
        classes: 'nav-item',
        icon: 'feather icon-file-text',
        
      },
      {
        id: 'risk-department',
        title: 'Incidents',
        type: 'item',
        url: 'risk-department',
        classes: 'nav-item',
        icon: 'feather icon-file-text',
        
      },
      {
        id: 'track',
        title:'Track',
        type: 'item',
        url: 'track',
        classes: 'nav-item',
        icon: 'feather icon-file-text',  
      },
      // {
      //   id: 'approved-incident',
      //   title: 'Updated Incidents',
      //   type: 'item',
      //   url: 'approved-incident',
      //   classes: 'nav-item',
      //   icon: 'feather icon-file-text',
        
      // },
 
      {
        id: 'user',
        title: 'User',
        type: 'item',
        url: 'user',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart',
      },
    ],
  },

];


@Injectable()
export class NavigationItem {
  get?(): NavigationItem[] { 
    return NavigationItems;
  }

}

// Logic to hide 'view-incident' based on user type
const userTType: string = ''; 


const updateViewIncidentItem = (item: NavigationItem) => {
  if (item.id === 'view-incident') {
    item.hidden = userTType === 'RC';
  }

  // Recursively update children
  if (item.children) {
    item.children.forEach(updateViewIncidentItem);
  }
};

// Apply the update logic to each item in the navigation
NavigationItems.forEach(updateViewIncidentItem);

export default NavigationItems;
