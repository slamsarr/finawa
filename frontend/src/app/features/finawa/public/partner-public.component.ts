import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { mockPartners } from '@core/data/finawa-platform.data'
import { AvatarComponent } from '@core/common/components/finawa-ui.component'

@Component({
  selector: 'app-partner-public',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent],
  template: `
    <main class="partner-public">
      <nav class="container d-flex align-items-center justify-content-between py-3">
        <a routerLink="/" class="d-flex align-items-center gap-2 text-decoration-none fw-bold">
          <img src="assets/images/logo.png" alt="FINAWA" height="34" /> FINAWA
        </a>
        <a routerLink="/auth/register" class="btn btn-primary">Envoyer mon dossier</a>
      </nav>

      <section class="partner-hero">
        <div class="container">
          <app-avatar [name]="partner.name" persona="FINANCEUR" [size]="96" />
          <span class="badge bg-light text-primary mt-3">{{ partner.type }}</span>
          <h1>{{ partner.name }}</h1>
          <p>{{ partner.description }}</p>
          <div class="chip-list justify-content-center">
            @for (zone of partner.zones; track zone) { <span>{{ zone }}</span> }
            @for (sector of partner.sectors; track sector) { <span>{{ sector }}</span> }
          </div>
        </div>
      </section>

      <section class="container py-5">
        <div class="row g-3">
          <div class="col-lg-4">
            <div class="finawa-panel h-100">
              <h5>Services</h5>
              <ul class="service-list">
                <li>Analyse de dossier PME</li>
                <li>Financement du besoin en fonds de roulement</li>
                <li>Accompagnement garanties et structuration</li>
              </ul>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="finawa-panel h-100">
              <h5>Conditions</h5>
              <p>{{ partner.conditions }}</p>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="finawa-panel h-100">
              <h5>Tarifs</h5>
              <p>{{ partner.pricing }}</p>
              <a routerLink="/auth/register" class="btn btn-primary w-100">Transmettre un dossier</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class PartnerPublicComponent {
  partner = mockPartners[0]

  constructor(route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get('id')
    this.partner = mockPartners.find((item) => item.id === id) || mockPartners[0]
  }
}
