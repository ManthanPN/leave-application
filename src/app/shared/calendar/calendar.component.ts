import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { LeaveApplicationServiceService } from '../../api-service/leave-application-service.service';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { AuthService } from '../../auth.service';
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
  user: string | null = '';
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    selectable: true,
    // themeSystem: 'bootstrap5',
    select: this.handleDateSelect.bind(this),
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
        this.loadingService.hideLoading();
      }
    }, Math.random() * 800 + 1000);
  }

  loadLeaveApplications() {
    this.loadingService.showLoading();
    this.leaveService.getLeaveApplications().subscribe(applications => {
      this.leaveApplications = applications;
      this.populateCalendarEvents();
    });
  }

  populateCalendarEvents() {
    this.user = this.authService.getSessionStorage();
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
    const selectedEndDate = new Date(selectInfo.endStr);
    selectedEndDate.setDate(selectedEndDate.getDate() - 1);
    const end = selectedEndDate.toISOString().split('T')[0];
    this.dateSelected.emit({ start, end });
  }
}
