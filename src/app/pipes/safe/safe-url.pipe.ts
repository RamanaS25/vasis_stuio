import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {
  sanitizer = inject(DomSanitizer)
  transform(value: any): any {
    // let url = value.replace("vimeo.com/", "player.vimeo.com/video/");
       console.log('jo', value)
      let link = "https://drive.google.com/file/d/"
      let url = link + value + '/preview'
      console.log(url)
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    
 

    //return this.sanitizer.bypassSecurityTrustUrl(url);
    //return url;
  }
  

}
