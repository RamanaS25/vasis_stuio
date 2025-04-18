import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  output,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  IonCard,
  IonLabel,
  IonItem,
  IonSearchbar,
  IonIcon,
  IonBadge,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CrudService } from 'src/app/services/crud';
import { addIcons } from 'ionicons';
import { peopleOutline } from 'ionicons/icons';
@Component({
  selector: 'app-teacher-view',
  templateUrl: './teacher-view.component.html',
  styleUrls: ['./teacher-view.component.scss'],
  standalone: true,
  imports: [
    IonBadge,
    IonIcon,
    IonSearchbar,
    IonItem,
    IonLabel,
    CommonModule,
    IonCard,
    FormsModule,
  ],
})
export class TeacherViewComponent implements OnInit, OnChanges {
  api = inject(CrudService);

  private _groups = signal<any[]>([]);
  @Input() set groups(value: any[]) {
    this._groups.set(value);
  }
  selectedGroup = output<any>();
  selectedGroupId = signal<string | null>(null);

  get groups() {
    return this._groups();
  }

  searchTerm = signal<string>('');

  filteredGroups = computed(() => {
    const groups = this._groups();
    const search = this.searchTerm();

    if (!search) {
      return groups;
    }
    return groups.filter((group) =>
      group.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  constructor() {
    addIcons({ peopleOutline });
  }

  ngOnInit() {
    // Set the first group as selected if groups are available
    if (this.groups.length > 0) {
      this.selectedGroupId.set(this.groups[0].id);
      this.selectedGroup.emit(this.groups[0]);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // When groups input changes, select the first group if available
    if (
      changes['groups'] &&
      this.groups.length > 0 &&
      !this.selectedGroupId()
    ) {
      this.selectedGroupId.set(this.groups[0].id);
      this.selectedGroup.emit(this.groups[0]);
    }
  }
}
