import { Component, OnInit, ViewChild } from '@angular/core';

import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { DataSharingService } from '../../_services/datasharing.service';
import { CommonLibrary } from '../../_library/common.library';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.css']
})
export class UserNotificationsComponent implements OnInit {

  userRequestList: PTOFromDBEntity[];
  userFlexList: FlexFromDBEntity[];
  displayedColumns: string[] = ['Requestor', 'Request Type', 'Description', 'Status', 'Action'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataRequestSource;
  dataFlexSource;

  constructor(private dataSharingService: DataSharingService) { }

  ngOnInit() {
    this.userRequestList = this.dataSharingService.userRequestList.getValue();
    this.userRequestList = CommonLibrary.sortListByProperty(this.userRequestList, "startDateTime");
    this.dataRequestSource = new MatTableDataSource(this.userRequestList);

    this.userFlexList = this.dataSharingService.userFlexList.getValue();
    this.userFlexList = CommonLibrary.sortListByProperty(CommonLibrary.sortListByProperty(this.userFlexList , "startDateTime"), "flexTypeId");
    this.dataFlexSource = new MatTableDataSource(this.userFlexList);
}

  //applyRequestFilter(filterValue: any) {
    //this.userRequestList.filter = filterValue.trim().toLowerCase();
  applyRequestFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataRequestSource.filter = filterValue.trim().toLowerCase();

    if (this.dataRequestSource.paginator) {
      this.dataRequestSource.paginator.firstPage();
    }
  }

  //applyFlexFilter(filterValue: any) {
  //  this.userFlexList.filter = filterValue.trim().toLowerCase();
  applyFlexFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFlexSource.filter = filterValue.trim().toLowerCase();

    if (this.dataFlexSource.paginator) {
      this.dataFlexSource.paginator.firstPage();
    }
  }
}
