import { Pipe, PipeTransform } from '@angular/core';
import { StatusService } from '../_services/status.service';
import { StatusFromDBEntity } from '../_entities/StatusFromDBEntity';

@Pipe({
  name: 'statusName'
})
export class StatusNamePipe implements PipeTransform {

  constructor(private statusService: StatusService) { }

  transform(statusId: any, ...args: any[]): string {
    let status: StatusFromDBEntity;
    this.statusService.getStatusById(statusId)
      .subscribe((data: StatusFromDBEntity) => {
        status = data;
      });
    return status.name;
  }
}
