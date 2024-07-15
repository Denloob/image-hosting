import { Routes } from '@angular/router';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageViewComponent } from './image-view/image-view.component';

export const routes: Routes = [
  { path: '', component: ImageUploadComponent }, // Root path for uploading images
  { path: 'view', component: ImageViewComponent }, // Path for viewing an image by its ID
  { path: '**', redirectTo: '' } // Redirect any unknown paths to the root
];
