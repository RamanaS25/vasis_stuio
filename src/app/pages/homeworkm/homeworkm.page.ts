import { Component, OnInit } from '@angular/core';
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
  IonFabList,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-homeworkm',
  templateUrl: './homeworkm.page.html',
  styleUrls: ['./homeworkm.page.scss'],
  standalone: true,
  imports: [
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

  payment_dates = [
    {
      grade: 1,
      levels: [
        {
          name: 'Level 1',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 2',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 3',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 4',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 5',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 6',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      grade: 2,
      levels: [
        {
          name: 'Level 1',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 2',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 3',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 4',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 5',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 6',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      grade: 3,
      levels: [
        {
          name: 'Level 1',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 2',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 3',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 4',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 5',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
        {
          name: 'Level 6',
          classes: [
            {
              name: 'Class 1',
              homework: [
                {
                  description: 'Homework for Class 1',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 2',
              homework: [
                {
                  description: 'Homework for Class 2',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
            {
              name: 'Class 3',
              homework: [
                {
                  description: 'Homework for Class 3',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: true,
                },
              ],
            },
            {
              name: 'Class 4',
              homework: [
                {
                  description: 'Homework for Class 4',
                  descriptionS: 'Simple Description',
                  descriptionP: 'Detailed Description',
                  is_melody: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  constructor() {
    addIcons({
      chevronBackOutline,
      addOutline,
      pencilOutline,
      trashBinOutline,
      chevronForwardOutline,
    });
  }

  get filteredLevel() {
    const selectedGrade = this.payment_dates.find(
      (grade) => grade.grade === this.selectedGrade
    );

    if (!selectedGrade) {
      return [];
    }
    console.log('blyaaaa', selectedGrade.levels);
    return selectedGrade.levels;
  }

  get filteredClass() {
    const selectedGrade = this.payment_dates.find(
      (grade) => grade.grade === this.selectedGrade
    );
    const selectedLevel = selectedGrade?.levels.find(
      (level) => level.name === this.selectedLevel
    );

    if (!selectedGrade || !selectedLevel) {
      return [];
    }
    return selectedLevel.classes;
  }

  get filteredHomework() {
    const selectedGrade = this.payment_dates.find(
      (grade) => grade.grade === this.selectedGrade
    );
    const selectedLevel = selectedGrade?.levels.find(
      (level) => level.name === this.selectedLevel
    );
    const selectedClass = selectedLevel?.classes.find(
      (classs) => classs.name === this.selectedClass
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

  ngOnInit() {}
}
