import { Pipe, PipeTransform } from '@angular/core';
import { StatusService } from '../_services/status.service';
import { StatusFromDBEntity } from '../_entities/StatusFromDBEntity';

@Pipe({
  name: 'statusName'
})
export class StatusNamePipe implements PipeTransform {

  constructor(private statusService: StatusService) { }

  transform(statusId: any, ...args: any[]): any {
    this.statusService.getStatusById(statusId)
      .toPromise()
      .then((status: StatusFromDBEntity) => {
        return status.name;
      });
  }
}
