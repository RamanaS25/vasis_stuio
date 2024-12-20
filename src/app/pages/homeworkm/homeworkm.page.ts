import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  addOutline,
  pencilOutline,
  trashBinOutline,
  chevronForwardOutline,
  chevronBackOutline, closeOutline } from 'ionicons/icons';
addIcons({
  addOutline: addOutline,
  pencilOutline: pencilOutline,
  trashBinOutline: trashBinOutline,
});
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonCard,
  IonList,
  IonSelect,
  IonSelectOption,
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList, IonChip, IonModal, IonToast, IonCardContent, IonButton, IonInput, IonCheckbox, IonBackButton } from '@ionic/angular/standalone';
import { HomeworkmService } from 'src/app/services//homeworkm/homeworkm.service';

@Component({
  selector: 'app-homeworkm',
  templateUrl: './homeworkm.page.html',
  styleUrls: ['./homeworkm.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButton, IonCardContent, IonToast, IonModal, IonChip, 
    IonFabList,
    IonIcon,
    IonFabButton,
    IonFab,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonItem,
    IonCol,
    IonRow,
    IonGrid,
    IonLabel,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenuButton,
    IonInput,
    IonCheckbox
  ],
})
export class HomeworkmPage implements OnInit {
  selectedGrade = 1;
  selectedLevel = '';
  selectedClass:any = {}
  homework_api = inject(HomeworkmService)
  homework_array:any = [] 
  homework_modal = false
  type: 'add' | 'edit' | 'delete' = 'add'
  new_homework:any = {
    is_exercise:false,
  }

  class_selected = false

  toast = {
    open:false,
    message:'',
    color:''
  }

  constructor() {
    addIcons({chevronBackOutline,addOutline,pencilOutline,trashBinOutline,closeOutline,chevronForwardOutline,});

    this.homework()
  }

  onClassChange(event:any) {
    this.class_selected = true
    this.selectedClass = event.detail.value

  }

  onLevelChange(event:any) {
    this.selectedLevel = event.detail.value
    this.class_selected = true
    console.log('filteredClass',this.filteredClass)
    this.selectedClass = this.filteredClass[0]
  }

  toast_handler(message:string, color:string) {
    this.toast.open = true
    this.toast.message = message
    this.toast.color = color
  }

  async  homework() {
    const res = await this.homework_api.getHomework()

    if (res.success) {
      console.log(res.data)

      if(res.data) this.homework_array = res.data

    } else {
      console.log(res.error)
    }
 
  }

  async deleteHomework() {
    const res = await this.homework_api.deleteHomework(this.new_homework.id)

    if (res.success) {
      this.homework_modal = false
      this.homework()
      this.new_homework = {}
      this.toast_handler('Homework deleted successfully', 'success')
    } else {
      this.toast_handler(res.error || 'Error deleting homework', 'danger')
    }
  }

  get filteredLevel() {
    const selectedGrade = this.homework_array.find(
      (grade:any) => grade.grade === this.selectedGrade
    );

    if (!selectedGrade) {
      return [];
    }
 
    return selectedGrade.levels;
  }

  get filteredClass() {
    const selectedGrade = this.homework_array.find(
      (grade:any) => grade.grade === this.selectedGrade
    );
    const selectedLevel = selectedGrade?.levels.find(
      (level:any) => level.name === this.selectedLevel
    );

    if (!selectedGrade || !selectedLevel) {
      return [];
    }
    return selectedLevel.classes.sort((a: { name: string; }, b: { name: string; }) => {
      const numA = parseInt(a.name.replace('Class ', ''));
      const numB = parseInt(b.name.replace('Class ', ''));
      return numA - numB;
    });
  }

  get filteredHomework() {
    const selectedGrade = this.homework_array.find(
      (grade:any) => grade.grade === this.selectedGrade
    );
    const selectedLevel = selectedGrade?.levels.find(
      (level:any) => level.name === this.selectedLevel
    );
    const selectedClass = selectedLevel?.classes.find(
      (classs:any) => classs.name === this.selectedClass.name
    );

    if (!selectedGrade || !selectedLevel || !selectedClass) {
      return [];
    }
    return selectedClass.homework;
  }

  get selectSmt() {
    if (this.selectedLevel === '') {
      return 'Please select a level';
    }
    if (this.selectedClass === '') {
      return 'Please select a class';
    }

    return '';
  }



  // crud operations

  checkbox_handler(event:any) {
    this.new_homework.is_exercise = event.detail.checked
  }

  async addHomework() {
    console.log('aaaaaaaaaaaaaaaaaaa',this.new_homework, this.selectedClass)
    let updated = {...this.new_homework, class_id:this.selectedClass.id}
    const res = await this.homework_api.upsertHomework(updated)

    if (res.success) {
      this.homework_modal = false
      this.homework()
      this.new_homework = { is_exercise:false }
      this.toast_handler('Homework added successfully', 'success')
    } else {
      this.toast_handler(res.error || 'Error adding homework', 'danger')
    }
  }

  ngOnInit() {
    console.log("homework management")
  }
}
