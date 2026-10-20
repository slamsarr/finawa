import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { TableService } from '@utils/table.service.ts'

@Component({
  selector: 'app-table-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-header.component.html',
  styles: ``,
})
export class TableHeaderComponent {
  constructor(public tableService: TableService<any>) {}
}
