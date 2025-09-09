import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '@app/constants';
import { PostStatusEnum } from '@app/domain/enum/post-status.enum';

@Pipe({
  name: 'postStatusLabel',
  standalone: true,
})
export class PostStatusLabelPipe implements PipeTransform {
  transform(status: PostStatusEnum): string {
    return Constants.descricoesPostStatus[status] || status;
  }
}
