import { Pipe, PipeTransform } from '@angular/core';
import { FlexTypeService } from '../_services/flextype.service';

@Pipe({
  name: 'flexTypeName'
})
export class FlexTypeNamePipe implements PipeTransform {

  constructor(private flexTypeService: FlexTypeService) { }

  transform(flexTypeId: any, ...args: any[]): string {
    return this.flexTypeService.getFlexTypeById(flexTypeId);
  };
}

