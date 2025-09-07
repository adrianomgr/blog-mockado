import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { publicBlogRoutes } from './public-blog.routes';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(publicBlogRoutes)],
})
export class PublicBlogModule {}
