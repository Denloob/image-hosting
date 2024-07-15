import { Component } from '@angular/core';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  standalone: true
})
export class ImageUploadComponent {
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  downloadURL: string | undefined;
  isDraggingOver: boolean = false;

  constructor(private storage: Storage, private router: Router) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile ? this.selectedFile.name : null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  mangleFilename(originalFileName: string): string {
    const uuid = uuidv4().replace(/-/g, '');
    return `${uuid}_${originalFileName}`;
  }

  uploadImage() {
    if (!this.selectedFile) {
      return;
    }
    const newFileName = this.mangleFilename(this.selectedFile.name);
    const filePath = `images/${newFileName}`;
    const storageRef = ref(this.storage, filePath);

    uploadBytes(storageRef, this.selectedFile).then(() => {
      this.router.navigate(['/view'], { queryParams: { q: newFileName } });
    });
  }
}
