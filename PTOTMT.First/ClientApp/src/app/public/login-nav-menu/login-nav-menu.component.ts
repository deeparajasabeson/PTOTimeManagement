import { Component, OnInit, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material';
import { DataStorageService } from '../../_services/datastorage.service';
import { UserFromDBEntity } from '../../_entities/UserFromDBEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { PTOService } from '../../_services/pto.service';
import { FlexService } from '../../_services/flex.service';
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
    let isLeadership: boolean = team.name == 'Leadership / Admin';
    //Active Requests count of all Reporting Team Members
    if (isLeadership) {   
      let ptoReporingMembersResponse = this.ptoService.getRequestsReportingMembers(user.id,new Date(), null ); 
      ptoReporingMembersResponse.then((data: PTOFromDBEntity[]) =>
      {
        let requestList = data;
            //Active Flex Requests count of all Reporting Team Members
        let flexResponse = this.flexService.getFlexsReportingMembers(user.id);
        flexResponse.then((data: FlexFromDBEntity[]) =>
        {
          let flexList = data;
          this.teamCounter = requestList.length + flexList.length;
        });
      });
    }

    //Requests count of all Reporting Team Members
    let ptoResponse = this.ptoService.getPTOsByUserId(user.id);
    ptoResponse.then((data: PTOFromDBEntity[]) =>
    {
      let requestList = data;
      let flexResponse = this.flexService.getFlexsByUserId(user.id);
      flexResponse.then((data: FlexFromDBEntity[]) =>
      {
        let flexList = data;
        this.userCounter = requestList.length + flexList.length;
      });
    });
  }
}
