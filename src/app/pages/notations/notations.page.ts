import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonBackButton, IonToolbar, IonButtons, IonMenuButton, IonRow, IonGrid, IonCol, IonItem, IonIcon, IonModal, IonInput, IonCardContent, IonCard, IonTabButton, IonButton, IonLabel, IonToast, Platform, IonSearchbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NotationsService } from 'src/app/services/notations/notations.service';
import { addIcons } from 'ionicons';
import { linkOutline, createOutline, closeOutline, documentTextOutline, eyeOutline } from 'ionicons/icons';
import { SafeUrlPipe } from "../../pipes/safe/safe-url.pipe";
import { LoginService } from 'src/app/services/auth/login.service';
addIcons({linkOutline});
@Component({
  selector: 'app-notations',
  templateUrl: './notations.page.html',
  styleUrls: ['./notations.page.scss'],
  standalone: true,
  imports: [ IonToast, IonButton, IonCard, IonCardContent, IonInput, IonModal, IonIcon, IonItem, IonCol, IonGrid, IonRow, IonButtons, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SafeUrlPipe]
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

  newPdfLinks = { pdf_link: '', pdf_link_s: '', pdf_link_por: '' }

  constructor() {
      addIcons({documentTextOutline,linkOutline,createOutline,closeOutline,eyeOutline}); }

  isMobile() {
    return this.platform.is('mobile') || this.platform.width() < 768;
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
    const result = await this._notations.getNotations(grade);

    if (result.success) {
      // Use result.data
      console.log(result.data)
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
      const result = await this._notations.updateNotationLink(notationId, updatedNotation);
      
      if (result.success) {
        // Update the local notation data
        this.editBool = false
        this.toast('Notation link updated successfully','success')
        this.notations = this.notations.map((notation: any) => 
          notation.id === notationId ? { ...notation, pdf_link: newLink } : notation
        );
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

  handlePdfView(item: any) {
    this.selectedClass = item;
    this.newPdfLinks = { pdf_link: item.pdf_link, pdf_link_s: item.pdf_link_s, pdf_link_por: item.pdf_link_por }
    if (this.isMobile()) {
      this.pdfModalOpen = true;
    }
  }

  
}
