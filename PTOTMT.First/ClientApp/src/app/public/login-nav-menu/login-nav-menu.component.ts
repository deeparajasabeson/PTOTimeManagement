import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserFromDBEntity } from '../../_entities/UserFromDBEntity';
import { DataStorageService } from '../../_services/datastorage.service';
import { DataSharingService } from '../../_services/datasharing.service';

@Component({
  selector: 'app-login-nav-menu',
  templateUrl: './login-nav-menu.component.html',
  styleUrls: ['./login-nav-menu.component.css']
})
export class LoginNavMenuComponent implements OnInit {
  isUserAuthenticated: boolean;
  user: UserFromDBEntity;
  @Input() fromParent;
  @Output() userNotifications = new EventEmitter();
  @Output() teamNotifications = new EventEmitter();

  constructor(private dataStorageService: DataStorageService,
                      private dataSharingService: DataSharingService) {  }
  
  ngOnInit() {
    // Subscribe here, this will automatically update "isUserAuthenticated" whenever a change to the subject is made.
    this.dataSharingService.isUserAuthenticated.subscribe(value => {
      this.isUserAuthenticated = value;
    });
    if (this.isUserAuthenticated) {
      this.user = this.dataStorageService.getUserEntity();
    }
  }

  showUserNotifications() {
    this.userNotifications.emit();
  }

  showTeamNotifications() {
    this.teamNotifications.emit();
  }
}
