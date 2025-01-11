import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonBackButton, IonToolbar, IonButtons, IonMenuButton, IonRow, IonGrid, IonCol, IonItem, IonIcon, IonModal, IonInput, IonCardContent, IonCard, IonTabButton, IonButton, IonLabel, IonToast, Platform, IonSearchbar, IonSpinner } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NotationsService } from 'src/app/services/notations/notations.service';
import { addIcons } from 'ionicons';
import { linkOutline, createOutline, closeOutline, documentTextOutline, eyeOutline,lockClosed } from 'ionicons/icons';
import { SafeUrlPipe } from "../../pipes/safe/safe-url.pipe";
import { LoginService } from 'src/app/services/auth/login.service';
import { HeaderComponent } from "../../components/header/header.component";
import { TranslatePipe } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
addIcons({linkOutline, lockClosed});
@Component({
  selector: 'app-notations',
  templateUrl: './notations.page.html',
  styleUrls: ['./notations.page.scss'],
  standalone: true,
  imports: [ IonToast, TranslatePipe, IonButton, IonCard, IonCardContent, IonInput, IonModal, IonIcon, IonItem, IonCol, IonGrid, IonRow, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SafeUrlPipe, HeaderComponent]
})
export class NotationsPage implements OnInit {
  auth = inject(LoginService)
  route = inject(ActivatedRoute)
  _notations = inject(NotationsService)
  grade = 0
  notations:any = []
  modalBool = false
  editBool = false 
  id = '1ru2mcA9TCg_ueIAbHzTYE7lnvL268Uvs'
  type = 'edit'
  selectedClass:any
  message = ''
  color = ''
  toastBool = false
  editingNotation: any = null;
  newPdfLink = ''
  pdfModalOpen = false;
  platform = inject(Platform);

  selectedLink = ''
  sanitizer = inject(DomSanitizer)  
  newPdfLinks = { pdf_link: '', pdf_link_s: '', pdf_link_por: '' }
  pdfLoaded = false;
  private urlCache: Map<string, SafeResourceUrl> = new Map();
  pdfUrl: SafeResourceUrl = '';

  constructor() {
      addIcons({eyeOutline,lockClosed,createOutline,closeOutline,documentTextOutline,linkOutline}); }

  isMobile() {
    return this.platform.is('mobile') || this.platform.width() < 768;
  }

  removeNumberFromName(name:string){
    return name.replace(/\d+|\s+/g, '');
  }

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
     this.grade = params['grade']; // Retrieve the passed parameter
      console.log(this.grade);
      this.getNotations(this.grade)
    });
    console.log('afasef',this.grade)
   
  }

  linkToPdf(link: string): void {
    const url = 'https://drive.google.com/file/d/' + link + '/preview';
    window.open(url, '_blank');
  }



  toast(message:string,color:string){
    this.message = message
    this.color = color
    this.toastBool = true
  }
  
  async getNotations(grade:number){
    console.log('group_name', this.auth._user)
    const result = await this._notations.getNotations(grade, this.auth._user.student_groups.name);

    if (result.success) {
      // Use result.data
      this.notations = result.data;
      this.selectedClass = this.notations[0]
    } else {
      // Handle the error
      this.toast('Error fetching notations','danger')
      console.error(result.error);
    }
  }   

  async updateLink(notationId: number, newLink: string) {
    try {

      let updatedNotation = {...this.selectedClass, ...this.newPdfLinks}
      console.log('updatedNotation', updatedNotation)
      const result = await this._notations.updateNotationLink(notationId, updatedNotation);
      
      if (result.success) {
        // Update the local notation data
        this.editBool = false
        this.toast('Notation link updated successfully','success')
        
        if(result.data){
        this.notations = this.notations.map((notation: any) => {
          if (notation.id === result.data.id) {
            return {
              ...notation,
              pdf_link: result.data.pdf_link,
              pdf_link_por: result.data.pdf_link_por, 
              pdf_link_s: result.data.pdf_link_s
            };
          }
          return notation;
        });
      }

        this.editingNotation = null;
       
      } else {  
        this.editBool = false
        this.toast('Failed to update notation','danger')
        console.error('Failed to update notation:', result.error);
      }
      
      return result;
    } catch (err) {
      this.editBool = false
      this.toast('Failed to update notation','danger')
      return {
        success: false,
        error: 'Failed to update notation link'
      };
    }
  }

  
  isPdfLocked(session:any){
    if(session?.session_date){
      let session_date = session.session_date
      const today = new Date();
      const sessionDate = new Date(session_date);
      const twoDaysFromNow = new Date();
      twoDaysFromNow.setDate(today.getDate() + 2);
      return sessionDate < twoDaysFromNow;
    } else {
      if(this.auth._user.grade >= this.grade){
        return true
      } 
    }
    return false
  }

  getSessionDate(session_date:string){
    console.log('session_date', session_date)
    const sessionDate = new Date(session_date);
    return sessionDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  handlePdfView(item: any) {
    this.pdfLoaded = false; // Reset loading state
    
    if(!this.isPdfLocked(item.student_sessions[0])){
      if(this.auth._user.grade == this.grade){
        this.toast(`This Pdf Will be Available 2 days before ${this.getSessionDate(item.student_sessions[0].session_date)}`,'warning');
        return;
      }
    }

    this.selectedClass = item;
    this.newPdfLinks = { 
      pdf_link: item.pdf_link, 
      pdf_link_s: item.pdf_link_s, 
      pdf_link_por: item.pdf_link_por 
    };

    if (this.isMobile()) {
      this.pdfModalOpen = true;
    }
  }

  handlePdfError(event: any) {
    console.error('PDF loading error:', event);
    this.pdfLoaded = false;
    this.toast('Error loading PDF', 'danger');
  }

}
