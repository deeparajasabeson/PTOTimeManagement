import { UserFromDBEntity } from '../_entities/UserFromDBEntity';
import { LocationFromDBEntity } from '../_entities/LocationFromDBEntity';
import { RoleFromDBEntity } from '../_entities/RoleFromDBEntity';
import { TeamFromDBEntity } from '../_entities/TeamFromDBEntity';

// UserFormData.ts
export interface UserFormData {
  id: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  ntLogin: string;
  emailAddress: string;
  leadershipUsers: UserFromDBEntity[],
  report2UserId: string,
  locationTypes: LocationFromDBEntity[];
  locationId: string;
  roles: RoleFromDBEntity[];
  roleId: string
  teams: TeamFromDBEntity[];
  teamId: string;
  isNewUser: boolean;
}
