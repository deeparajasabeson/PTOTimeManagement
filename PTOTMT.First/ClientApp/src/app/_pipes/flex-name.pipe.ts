import { Pipe, PipeTransform } from '@angular/core';
import { FlexTypeService } from '../_services/flextype.service';

@Pipe({
  name: 'flexName'
})
export class FlexNamePipe implements PipeTransform {

  constructor(private flexTypeService: FlexTypeService) { }

  transform(flexTypeId: any, ...args: any[]): any {
    return this.flexTypeService.getFlexTypeById(flexTypeId);
  };
}

