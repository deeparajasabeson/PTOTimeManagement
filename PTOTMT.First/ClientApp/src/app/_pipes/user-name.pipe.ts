import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserFromDBEntity } from '../_entities/UserFromDBEntity';

@Pipe({
  name: 'statusName'
})
export class UserNamePipe implements PipeTransform {

  constructor(private userService: UserService) { }

  transform(userId: any, ...args: any[]): any {
    this.userService.getUserById(userId)
      .toPromise()
      .then((user: UserFromDBEntity) => {
        return user.firstName + " " + user.lastName;
      });
  }
}
