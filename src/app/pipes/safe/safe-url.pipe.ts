import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {
  sanitizer = inject(DomSanitizer)
  transform(value: any, args?: any): any {
    // let url = value.replace("vimeo.com/", "player.vimeo.com/video/");
    if (value) {
      let link = "https://drive.google.com/file/d/"
      let url = link + value + '/preview'
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      value = "https://drive.google.com/file/d/1De6eNuOZgfe_7_aBn4G2UCAYu2QP-5h-/preview"
    }
 

    //return this.sanitizer.bypassSecurityTrustUrl(url);
    //return url;
  }
  

}
