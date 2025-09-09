import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '@app/constants';
import { ProfileEnum } from '@app/domain/enum/profile.enum';

@Pipe({
  name: 'roleLabel',
  standalone: true,
})
export class RoleLabelPipe implements PipeTransform {
  transform(role: ProfileEnum): string {
    return Constants.descricoesProfile[role] || role;
  }
}
