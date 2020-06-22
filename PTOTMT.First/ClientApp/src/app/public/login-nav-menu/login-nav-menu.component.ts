import { Component, OnInit, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material';
import { DataStorageService } from '../../_services/datastorage.service';
import { PTOService } from '../../_services/pto.service';
import { FlexService } from '../../_services/flex.service';
import { UserFromDBEntity } from '../../_entities/UserFromDBEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { TeamFromDBEntity } from '../../_entities/TeamFromDBEntity';


@Component({
  selector: 'app-login-nav-menu',
  templateUrl: './login-nav-menu.component.html',
  styleUrls: ['./login-nav-menu.component.css']
})
export class LoginNavMenuComponent implements OnInit {
   public userName: string;
  userCounter: number = 0;
  teamCounter: number = 0;
  @Input() isAuthenticated: boolean;

  constructor(private dataStorageService: DataStorageService,
                      private ptoService: PTOService,
                      private flexService: FlexService) {
  }
  
  ngOnInit() {
    let user: UserFromDBEntity = this.dataStorageService.getUserEntity();
    let team: TeamFromDBEntity = this.dataStorageService.getTeamEntity();

    let isLeadership: boolean = (team.name == 'Leadership / Admin');
    if (isLeadership) {   
    //Active PTO Requests count of all Reporting Team Members
      let ptoReporingMembersResponse = this.ptoService.getRequestsReportingMembers(user.id,new Date(), null );
      ptoReporingMembersResponse.then((data: PTOFromDBEntity[]) =>
      {
        let requestList = data;
        //Active Flex Requests count of all Reporting Team Members
        let flexResponse = this.flexService.getFlexsReportingMembers(user.id, new Date(), null);
        flexResponse.then((data: FlexFromDBEntity[]) =>
        {
          let flexList = data;
          this.teamCounter = requestList.length + flexList.length;
        });
      });
    }

    //Active PTO Requests count for the current user
    let ptoResponse = this.ptoService.getPTOsByUserIdInDateRange(user.id, new Date(), null);
    ptoResponse.then((data: PTOFromDBEntity[]) =>
    {
      let requestList = data;
      //Active Flex Requests count for the current user
      let flexResponse = this.flexService.getFlexsByUserIdInDateRange(user.id, new Date(), null);
      flexResponse.then((data: FlexFromDBEntity[]) =>
      {
        let flexList = data;
        this.userCounter = requestList.length + flexList.length;
      });
    });
  }
}
