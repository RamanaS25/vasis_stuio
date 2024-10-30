import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {
  sanitizer = inject(DomSanitizer)
  transform(value: string, type: string): SafeResourceUrl {
    console.log(value)
    switch (type) {
      case 'resourceUrl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://drive.google.com/file/d/${value}/preview`
        );
      default:
        return value;
    }
  }

}
