import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  addOutline,
  pencilOutline,
  trashBinOutline,
  chevronForwardOutline,
  chevronBackOutline,
} from 'ionicons/icons';
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
  IonFabList, IonChip } from '@ionic/angular/standalone';
import { HomeworkmService } from 'src/app/services//homeworkm/homeworkm.service';

@Component({
  selector: 'app-homeworkm',
  templateUrl: './homeworkm.page.html',
  styleUrls: ['./homeworkm.page.scss'],
  standalone: true,
  imports: [IonChip, 
    IonFabList,
    IonIcon,
    IonFabButton,
    IonFab,
    IonSelect,
    IonSelectOption,
    IonList,
    IonCard,
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonCol,
    IonRow,
    IonGrid,
    IonLabel,
    IonSegmentButton,
    IonSegment,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenuButton,
  ],
})
export class HomeworkmPage implements OnInit {
  selectedGrade = 1;
  selectedLevel = '';
  selectedClass = '';
  homework_api = inject(HomeworkmService)
  homework_array:any = []

  constructor() {
    addIcons({
      chevronBackOutline,
      addOutline,
      pencilOutline,
      trashBinOutline,
      chevronForwardOutline,
    });

    this.homework()
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
    return selectedLevel.classes;
  }

  get filteredHomework() {
    const selectedGrade = this.homework_array.find(
      (grade:any) => grade.grade === this.selectedGrade
    );
    const selectedLevel = selectedGrade?.levels.find(
      (level:any) => level.name === this.selectedLevel
    );
    const selectedClass = selectedLevel?.classes.find(
      (classs:any) => classs.name === this.selectedClass
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

  ngOnInit() {
    console.log("homework management")
  }
}
