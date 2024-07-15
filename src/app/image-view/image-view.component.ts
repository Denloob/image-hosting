import { Component, OnInit } from '@angular/core';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
  standalone: true
})
export class ImageViewComponent implements OnInit {
  imageId: string | null = null;
  imageUrl: string | undefined;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  imageName: string | null = null; // Variable to store the image name

  constructor(private storage: Storage, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.imageId = this.route.snapshot.queryParamMap.get('q');

    if (!this.imageId) {
      this.errorMessage = 'Invalid image ID.';
      this.isLoading = false;
      return;
    }

    const filePath = `images/${this.imageId}`;
    const storageRef = ref(this.storage, filePath);

    getDownloadURL(storageRef)
      .then(url => {
        this.imageUrl = url;
        this.imageName = this.demangleFilename(this.imageId!);
      })
      .catch(error => {
        console.error('Error fetching image URL:', error);
        this.errorMessage = 'Failed to load the image.';
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  demangleFilename(filename: string): string {
    // Filename is like `randomrandom_real_filename.png` so to demangle it, we
    //  remove everything before and including the first `_`, if we can
    const underscoreIndex = filename.indexOf('_');
    return underscoreIndex !== -1 ? filename.substring(underscoreIndex + 1) : filename;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
