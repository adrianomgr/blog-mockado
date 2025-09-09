import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '@app/constants';
import { ProfileEnum } from '@app/domain/enum/profile.enum';
import { TagSeverityEnum } from '@app/domain/enum/tag-severity.enum';

@Pipe({
  name: 'roleSeverity',
  standalone: true,
})
export class RoleSeverityPipe implements PipeTransform {
  transform(role: ProfileEnum): TagSeverityEnum {
    return Constants.severityProfile[role] || TagSeverityEnum.INFO;
  }
}
