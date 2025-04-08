import { Routes } from '@angular/router';

import { ROUTES } from '@/constant/route.constant';
import { HomeComponent } from './home/home.component';
import { EditorComponent } from './editor/editor.component';

export const routes: Routes = [
  {
    title: 'Homepage',
    component: HomeComponent,
    path: ROUTES.BASEPATH.HOME,
  },
  {
    title: 'Editor',
    component: EditorComponent,
    path: ROUTES.BASEPATH.EDITOR,
  },
];
