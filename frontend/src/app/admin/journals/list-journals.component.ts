import { Component, OnInit, inject } from '@angular/core'
import { AsyncPipe, CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { NgbModal, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { Observable, tap } from 'rxjs'
import { JournalService } from '@openapi/services'
import { Journal, ResponseListJournal } from '@openapi/models'

@Component({
  selector: 'app-list-journals',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule, NgbModalModule, AsyncPipe, RouterLink],
  templateUrl: './list-journals.component.html',
})
export class ListJournalsComponent implements OnInit {
  private journalService = inject(JournalService)
  private modalService = inject(NgbModal)

  journals$: Observable<ResponseListJournal> | null = null
  totalElements = 0
  page = 1
  size = 15

  filterLogin = ''
  filterAction = ''
  filterMethod = ''
  filterDate = ''

  selectedJournal: Journal | null = null

  ngOnInit() {
    this.load()
  }

  load() {
    const searchParams: Record<string, string> = {}
    if (this.filterLogin.trim()) searchParams['login'] = this.filterLogin.trim()
    if (this.filterAction.trim()) searchParams['actionType'] = this.filterAction.trim()
    if (this.filterMethod.trim()) searchParams['method'] = this.filterMethod.trim()
    if (this.filterDate) searchParams['creationDate'] = this.filterDate

    this.journals$ = this.journalService.readAllJournals({
      searchParams,
      pageable: { page: this.page - 1, size: this.size, sort: ['creationDate'] },
    }).pipe(tap(res => {
      this.totalElements = res.metadata?.totalElements ?? 0
    }))
  }

  onFilter() {
    this.page = 1
    this.load()
  }

  onPageChange(p: number) {
    this.page = p
    this.load()
  }

  onReset() {
    this.filterLogin = ''
    this.filterAction = ''
    this.filterDate = ''
    this.onFilter()
  }

  viewDetail(content: unknown, journal: Journal) {
    this.selectedJournal = journal
    this.modalService.open(content, { centered: true, size: 'lg' })
  }

  methodClass(method?: string): string {
    return ({
      GET: 'success',
      POST: 'primary',
      PUT: 'warning',
      DELETE: 'danger',
      PATCH: 'info',
    } as Record<string, string>)[method ?? ''] ?? 'secondary'
  }
}
