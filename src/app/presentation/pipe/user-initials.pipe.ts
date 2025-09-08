import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userInitials',
})
export class UserInitialsPipe implements PipeTransform {
  transform(authorName: string): string {
    if (!authorName) return 'U';

    const names = authorName.split(' ').filter((name) => name.length > 0);
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0]?.[0]?.toUpperCase() || 'U';
  }
}
