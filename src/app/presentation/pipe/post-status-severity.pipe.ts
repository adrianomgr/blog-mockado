import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '@app/constants';
import { PostStatusEnum } from '@app/domain/enum/post-status.enum';
import { TagSeverityEnum } from '@app/domain/enum/tag-severity.enum';

@Pipe({
  name: 'postStatusSeverity',
  standalone: true,
})
export class PostStatusSeverityPipe implements PipeTransform {
  transform(status: PostStatusEnum): TagSeverityEnum {
    return Constants.severityPostStatus[status] || TagSeverityEnum.INFO;
  }
}
