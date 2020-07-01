import { UserFromDBEntity } from '../_entities/UserFromDBEntity';
import { LocationFromDBEntity } from '../_entities/LocationFromDBEntity';
import { RoleFromDBEntity } from '../_entities/RoleFromDBEntity';
import { TeamFromDBEntity } from '../_entities/TeamFromDBEntity';

// UserFormData.ts
export interface UserFormData {
  id: string;
  firstName: string;
  lastName: string;
  ntLogin: string;
  emailAddress: string;
  leadershipUsers: UserFromDBEntity[],
  reportToUserId: string,
  locationTypes: LocationFromDBEntity[];
  locationId: string;
  roles: RoleFromDBEntity[];
  roleId: string
  teams: TeamFromDBEntity[];
  teamId: string;
  isNewUser: boolean;
}
