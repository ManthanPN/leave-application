import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { LeaveApplicationServiceService } from '../../api-service/leave-application-service.service';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { AuthService } from '../../service/auth.service';
import { LoadingService } from '../../features-module/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import bootstrap5Plugin from '@fullcalendar/bootstrap5'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit, OnChanges {
  @Input() leaveApplications: any[] = [];
  @Output() dateSelected = new EventEmitter<{ start: string, end: string }>();
  @Output() pendingLeaveAction = new EventEmitter<any>();

  user: string | null = '';
  selectedDates: Set<string> = new Set();
  pendingLeaves: Map<string, any> = new Map();

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    selectable: true,
    // themeSystem: 'bootstrap5',
    select: this.handleDateSelect.bind(this),
    eventClassNames: ['approve', 'otherclassname'],
    events: []
  };

  constructor(
    private leaveService: LeaveApplicationServiceService,
    private loadingService: LoadingService,
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loadLeaveApplications()
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      if (changes['leaveApplications'] && !changes['leaveApplications'].firstChange) {
        this.populateCalendarEvents();
        this.updateSelectedDates();
        this.loadingService.hideLoading();
      }
    }, Math.random() * 800 + 1000);
  }

  loadLeaveApplications() {
    this.loadingService.showLoading();
    this.leaveService.getLeaveApplications().subscribe(applications => {
      this.leaveApplications = applications;
    });
  }

  updateSelectedDates() {
    this.selectedDates.clear();
      this.leaveApplications.forEach((app) => {
        let currentDate = new Date(app.startDate);
        const endDate = new Date(app.endDate);
        while (currentDate <= endDate) {
          const dateString = currentDate.toISOString().split('T')[0];
          if (app.status === 'approved') {
            this.selectedDates.add(dateString);
          } else if (app.status === 'pending'){
            this.pendingLeaves.set(dateString, app);
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
  }

  populateCalendarEvents() {
    this.user = this.authService.getUserId();
    this.calendarOptions.events = this.leaveApplications
      .filter(app => app.username === this.user)
      .map(app => ({
        title: app.reason,
        start: app.startDate,
        end: new Date(new Date(app.endDate).setDate(new Date(app.endDate).getDate() + 1)).toISOString().split('T')[0],
        textColor: '#000',
        backgroundColor: app.status === 'approved' ? '#7ddc58' : app.status === 'rejected' ? '#fe6262ea' : '#ffdd45',
        borderColor: 'white'
      }));
  }

  handleDateSelect(selectInfo: any) {
    const start = selectInfo.startStr;

    if (this.pendingLeaves.has(start)) {
      const pendingLeave = this.pendingLeaves.get(start);
      this.pendingLeaveAction.emit(pendingLeave);
      return;
    }

    const selectedEndDate = new Date(selectInfo.endStr);
    selectedEndDate.setDate(selectedEndDate.getDate() - 1);
    const end = selectedEndDate.toISOString().split('T')[0];

    let currentDate = new Date(start);
    while (currentDate <= new Date(end)) {
      const currentDateString = currentDate.toISOString().split('T')[0];
      const isPending = this.leaveApplications.some(
        (app) =>
          app.status === 'pending' &&
          new Date(app.startDate) <= currentDate &&
          currentDate <= new Date(app.endDate)
      );
      if (this.selectedDates.has(currentDateString) || isPending ) {
        this.toastr.warning('Date is already approved.');
        return;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    this.dateSelected.emit({ start, end });
  }

}

