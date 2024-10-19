import { Component, Input, OnInit } from '@angular/core';
import { SafeUrlPipe } from 'src/app/pipes/safe/safe-url.pipe';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
  standalone: true,
  imports: [
   SafeUrlPipe
  ]
})
export class PdfComponent  implements OnInit {
  @Input() previewId!: string;
  googleDriveUrl!: string;
  constructor() { }
  

  ngOnInit() {
    console.log('pdf',this.previewId)
    console.log('pdf')
  }

}
