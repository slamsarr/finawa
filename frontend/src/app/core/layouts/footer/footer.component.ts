import { Component } from '@angular/core'
import { credits, currentYear } from '@utils/constants'

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styles: ``,
})
export class FooterComponent {
  currentYear = currentYear
  credits = credits
}
