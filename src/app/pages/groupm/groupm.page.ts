import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent, 
  IonCardHeader,
  IonChip,
  IonCol,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonToast,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { GroupManagementService } from 'src/app/services/group/group-management.service';
import { Group, StudentSession } from './types';


import { addIcons } from 'ionicons';
import { ellipse, playOutline, createOutline, close } from 'ionicons/icons';
import { YoutubePlayerComponent } from 'src/app/components/youtube-player/youtube-player.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { LoginService } from 'src/app/services/auth/login.service';
import { HeaderComponent } from "../../components/header/header.component";


addIcons({ellipse, playOutline, createOutline, close});

@Component({
  selector: 'app-groupm',
  templateUrl: './groupm.page.html',
  styleUrls: ['./groupm.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    ProfileComponent,
    IonDatetime,
    YoutubePlayerComponent,
    IonSearchbar,
    IonToast,
    IonDatetimeButton,
    IonDatetime,
    IonModal,
    IonSegment,
    IonSegmentButton,
    IonChip,
    IonButton,
    IonIcon,
    IonLabel,
    IonItem,
    IonCardHeader,
    IonCardContent,
    IonText,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    IonSelect,
    IonSelectOption
  ],
  providers: [DatePipe] 
})

export class GroupmPage implements OnInit {
  api = inject(GroupManagementService);
  datePipe = inject(DatePipe)
  auth = inject(LoginService)
  selectedItem:Group = {
    name: '',
    start_date: '',
    end_date: '',
    weeks: 0,
    id: 0,
    course_id: 0,
    status: false,
    zoom_link: '',
    syllabus_grades: {
      grade: 0
    },
    student_sessions: []
  }
  groups:Group[] = []
  selectedView:string = 'Live Sessions'

  new_start_date:string = ''
  new_session_date:string = ''

  isOpenGroup = false;
  watchVideo = false
  is_profile_open = false
  edit_type:string = 'start_date'

  message: string = '';
  color: string = 'danger';
  duration: number = 3000;
  toastBool = false; 
  searchTerm:string = ''
  
  start_edit:Group = {
    name: '',
    start_date: '',
    end_date: '',
    weeks: 0,
    id: 0,
    course_id: 0,
    status: false,
    zoom_link: '',
    syllabus_grades: {
      grade: 0
    },
    student_sessions: []
  }

  classes:any[] = []

  selectedSession:StudentSession = {
    id: 0,
    session_date: '',
    week_num: 0,
    recorded_class: ''
  }

  updated_session:StudentSession = {
    id: 0,
    session_date: '',
    week_num: 0,
    recorded_class: ''
  }

  new_group = {
    grade_id: 0,
    name: '',
    start_date: new Date().toISOString(),
    end_date: '',
    weeks: 0,
    course_id: 1,
    status: true,
    zoom_link: ''
  }
  addGroupBool = false

  editZoomLink = false

  constructor() { 
     this.getGroups()
     this.getClasses()
  }

  async getClasses(){
    let x = await this.api.getClasses()
    if(x.success){
      console.log(x.data)
      this.classes = x.data
    }else{
      this.toast('Error In getting Classes', 'danger', 3000)
      console.error(x.error)
    }
  }

  setDateForNewGroup(event:any){
    console.log(event)
    this.new_group.start_date = event.detail.value
  }

  async editLiveSessions(){
  
    this.updated_session.week_num = this.selectedSession.week_num
    this.updated_session.recorded_class = this.selectedSession.recorded_class
    this.updated_session.id = this.selectedSession.id
    console.log(this.updated_session)
    let x = await this.api.editLiveSession(this.updated_session.id, this.updated_session)

    if(x.success){
       this.toast('Session Updated', 'success', 3000)

       this.updated_session = {
        id: 0,
        session_date: '',
        week_num: 0,
        recorded_class: ''
      }
       this.isOpenGroup = false;
        this.selectedSession = {
          id: 0,
          session_date: '',
          week_num: 0,
          recorded_class: ''
        }
       this.getGroups()
    }else{
      this.toast('Error In Operation', 'danger', 3000)
      console.error(x.error)
    }
    
  }

  get _groups() {

     if(this.searchTerm === ''){
      return this.groups
    }
    return this.groups?.filter((group) => {
      return group?.name?.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  getClassesForInsert(grade:number){
    console.warn(this.classes, grade)
    return this.classes.filter((c) => {
      return c.syllabus_levels.syllabus_grades.grade == grade
    })  
  }
  
  toast(message: string, color: string, duration: number) {
    this.message = message;
    this.color = color;
    this.duration = duration;
    this.toastBool = true;
  }

  async insertRecordedClass(){

    this.updated_session.id = this.selectedSession.id

    console.log(this.updated_session, this.selectedSession)
    let x = await this.api.insertRecordedClass(this.updated_session)
    if(x.success){
      this.toast('Recorded Class Added', 'success', 3000)
      this.updated_session = {
        id: 0,
        session_date: '',
        week_num: 0,
        recorded_class: ''
      }
      this.isOpenGroup = false;
      this.getGroups()
    }else{
      this.toast('Error In Operation', 'danger', 3000)
      console.error(x.error)
    }
  }

  checkDateStatus(dateString: string): string {
    // Convert the input date to a Date object
    const inputDate = new Date(dateString);
    const today = new Date();
    
    // Remove time part of today's date for accurate comparison
    today.setHours(0, 0, 0, 0);
  
    // Calculate the difference in days between the input date and today
    const differenceInTime = inputDate.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    if (differenceInDays < 0) {
      // The date is in the past
      return "past";
    } else if (differenceInDays <= 7) {
      // The date is within the next 10 days
      return "next";
    } else {
      // The date is more than 10 days in the future
      return "future";
    }
  }
  
  ngOnInit() {
    console.log('groupm')
  }

  async getGroups() {
  this.groups = []
  console.log('get groups')
   let x = await this.api.getGroups();
   if(x.success) {
    this.groups = x.data ?? []
    console.log(this.groups)
    
   }
  }

  formatToISOWithoutMilliseconds(dateString: string): string {
    // Create a new Date object from the input date string
    const date = new Date(dateString);
  
    // Get the individual components of the date in UTC time
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
    // Combine the components into the desired format without milliseconds and with +00:00 timezone
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;
  }

  setDate(date:any){

    const localDate = new Date(date.detail.value);

    // Convert the date to UTC by using Date's toISOString() method
    const utcDateString = localDate.toISOString();

    let x = this.formatToISOWithoutMilliseconds(utcDateString)

     if(this.edit_type === 'start_date'){
      this.start_edit.start_date = x
     }else{
      this.updated_session.session_date = x
     }
  
    console.log(this.start_edit)
    
  }

  async editStartDate(group:any) {
    this.start_edit.name = group.name
    this.start_edit.id = group.id
    this.start_edit.course_id = group.course_id
    this.start_edit.status = group.status
     this.start_edit.zoom_link = group.zoom_link
     this.start_edit.student_sessions = group.student_sessions
     this.start_edit.end_date = group.end_date
     this.start_edit.weeks = 24
     this.start_edit.syllabus_grades = group.syllabus_grades
     console.log(this.start_edit)

      let class_list = this.getClassesForInsert(group.syllabus_grades.grade)
      let x = await this.api.updateGroupSessions(this.start_edit, class_list);
      
     if(x.success){
      this.toast('Start Date Updated', 'success', 3000)
      this.isOpenGroup = false;
      this.groups = []
      this.selectedItem = {
        name: '',
        syllabus_grades: {
          grade: 0
        },
        start_date: '',
        end_date: '',
        weeks: 0,
        id: 0,
        course_id: 0,
        status: false,
        zoom_link: '',
        student_sessions: []
     } 
     this.getGroups()
    }else{
      this.toast('Error In Operation', 'danger', 3000)
      console.error(x.error)
    }
  }

  async addGroup(){
    console.log(this.new_group)
    let classes = this.getClassesForInsert(this.new_group.grade_id)
    console.log("classes", classes)
    
    let end_date = new Date(this.new_group.start_date)
    this.new_group.weeks = 24
    end_date.setDate(end_date.getDate() + (24 * 7))
    this.new_group.end_date = end_date.toISOString()

    console.log(this.new_group)
    console.log(classes)
    let x = await this.api.addGroup(this.new_group, classes)
 
    if(x.success){
      this.addGroupBool = false
      this.toast('Group Added', 'success', 3000)

      this.new_group = {
        zoom_link: '',
        grade_id: 0,
        name: '',
        start_date: '',
        end_date: '',
        weeks: 0,
        course_id: 0,
        status: false,
      }

      

      this.getGroups()
    }else{
      this.addGroupBool = true
      this.toast('Error In Operation', 'danger', 3000)
      console.error(x.error)
    }
  }

  async deleteGroup(group:any){
    let x = await this.api.deleteGroup(group)
    if(x.success){
      this.toast('Group Deleted', 'success', 3000)
       this.groups = this.groups.filter((g) => g.id !== group.id)
    }else{
      this.toast('Error In Operation', 'danger', 3000)
      console.error(x.error)
    }
  }

  async updateZoomLink(){
    let x = await this.api.updateZoomLink(this.selectedItem, this.selectedItem.zoom_link)
    if(x.success){
      this.toast('Zoom Link Updated', 'success', 3000)
      this.editZoomLink = false
      this.getGroups()
    }else{
      this.toast('Error In Operation', 'danger', 3000)
      console.error(x.error)
    }
  }

  }


