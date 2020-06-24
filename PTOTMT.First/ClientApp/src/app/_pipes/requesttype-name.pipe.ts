import { Pipe, PipeTransform } from '@angular/core';
import { RequestTypeFromDBEntity } from '../_entities/RequestTypeFromDBEntity';
import { RequestTypeService } from '../_services/requesttype.service';


@Pipe({
  name: 'requestTypeName'
})
export class RequestTypeNamePipe implements PipeTransform {

  constructor(private requestTypeService: RequestTypeService) { }

  transform(requestTypeId: any, ...args: any[]): string {
    let flexTypeName: string = "";
    this.requestTypeService.getRequestTypeById(requestTypeId)
      .toPromise()
      .then((data: RequestTypeFromDBEntity) => {
        flexTypeName = data.name;
    });
    return flexTypeName;
  };
}

