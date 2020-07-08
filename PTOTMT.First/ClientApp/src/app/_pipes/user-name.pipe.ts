import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../_services/user.service';
import { UserFromDBEntity } from '../_entities/UserFromDBEntity';

@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {

  constructor(private userService: UserService) { }

  transform(userId: any, ...args: any[]): string {
    let user: UserFromDBEntity;
    this.userService.getUserById(userId)
      .subscribe((data: UserFromDBEntity) => {
        user = data;
      });
    return user.firstName + " " + user.lastName;
  }
}
