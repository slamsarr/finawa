import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import {
  DossierStatus,
  Persona,
  dossierSteps,
  personaColors,
  personaLabels,
} from '@core/data/finawa-platform.data'

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="fw-bold text-white d-inline-flex align-items-center justify-content-center rounded-circle"
      [style.background]="color"
      [style.width.px]="size"
      [style.height.px]="size">
      {{ initials }}
    </span>
  `,
})
export class AvatarComponent {
  @Input() name = 'Utilisateur FINAWA'
  @Input() persona: Persona = 'ENTERPRISE'
  @Input() size = 40

  get initials(): string {
    return this.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }

  get color(): string {
    return personaColors[this.persona]
  }
}

@Component({
  selector: 'app-persona-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge rounded-pill"
      [style.background]="color + '1f'"
      [style.color]="color">
      {{ label }}
    </span>
  `,
})
export class PersonaBadgeComponent {
  @Input() persona: Persona = 'ENTERPRISE'

  get color(): string {
    return personaColors[this.persona]
  }

  get label(): string {
    return personaLabels[this.persona]
  }
}

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge rounded-pill px-3 py-2" [ngClass]="className">
      {{ label }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input() status: DossierStatus | string = 'EN_COURS'

  get label(): string {
    return String(this.status).replace('_', ' ')
  }

  get className(): string {
    const map: Record<string, string> = {
      EN_COURS: 'bg-primary-subtle text-primary border border-danger-subtle',
      PREQUALIFIE: 'bg-danger text-white',
      TRANSMIS: 'bg-primary text-white',
      APPROUVE: 'bg-danger-emphasis text-white',
      REJETE: 'bg-secondary-subtle text-secondary border',
      ARCHIVE: 'bg-light text-muted border',
    }
    return map[String(this.status)] || 'bg-light text-muted border'
  }
}

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="finawa-kpi h-100" [style.--tone]="tone">
      <div class="d-flex flex-column justify-content-between h-100">
        <div>
          <span class="finawa-kpi-label">{{ label }}</span>
          <h3 class="finawa-kpi-value">{{ value }}</h3>
        </div>
        <div class="d-flex align-items-center gap-1 mt-2">
          <span class="finawa-kpi-trend">{{ trend }}</span>
        </div>
      </div>
      <div class="finawa-kpi-icon">
        <i [class]="icon"></i>
      </div>
    </div>
  `,
  styles: [
    `
      .finawa-kpi {
        min-height: 120px;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 1.25rem 1.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ffffff;
        box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        position: relative;
        overflow: hidden;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      }

      .finawa-kpi::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
        background: var(--tone);
      }

      .finawa-kpi:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
        border-color: #cbd5e1;
      }

      .finawa-kpi-label {
        color: #64748b;
        font-size: 0.82rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        display: block;
        margin-bottom: 0.35rem;
      }

      .finawa-kpi-value {
        color: #1a252f;
        font-size: 1.75rem;
        font-weight: 800;
        margin: 0;
        line-height: 1.15;
      }

      .finawa-kpi-trend {
        color: var(--tone);
        font-weight: 700;
        font-size: 0.8rem;
        background: color-mix(in srgb, var(--tone) 10%, #fff);
        padding: 0.2rem 0.55rem;
        border-radius: 6px;
      }

      .finawa-kpi-icon {
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: color-mix(in srgb, var(--tone) 12%, #fff);
        color: var(--tone);
        font-size: 1.6rem;
        flex-shrink: 0;
      }
    `,
  ],
})
export class KpiCardComponent {
  @Input() label = ''
  @Input() value = ''
  @Input() trend = ''
  @Input() icon = 'iconoir-stats-up-square'
  @Input() tone = '#c41e3a'
}

@Component({
  selector: 'app-score-gauge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="score-card">
      <div class="score-main">
        <div class="score-ring-wrapper">
          <div class="score-ring" [style.--score]="score" [style.--ring-color]="color">
            <div class="score-inner">
              <strong>{{ score }}</strong>
              <small>/100</small>
            </div>
          </div>
          <span class="score-status-tag" [style.background]="color + '18'" [style.color]="color">
            {{ riskLabel }}
          </span>
        </div>
        <div class="score-info">
          <span class="score-eyebrow">Diagnostic Bancabilité</span>
          <h5 class="score-title">{{ title }}</h5>
          <p class="score-desc">{{ description }}</p>
        </div>
      </div>

      <div class="score-pillars mt-3 pt-3 border-top">
        <div class="pillar-item">
          <div class="pillar-meta">
            <span>Solidité financière & CA</span>
            <strong>{{ subScores.financial }}%</strong>
          </div>
          <div class="pillar-track"><div class="pillar-fill" [style.width.%]="subScores.financial" style="background: #c41e3a;"></div></div>
        </div>
        <div class="pillar-item">
          <div class="pillar-meta">
            <span>Conformité juridique & NINEA</span>
            <strong>{{ subScores.compliance }}%</strong>
          </div>
          <div class="pillar-track"><div class="pillar-fill" [style.width.%]="subScores.compliance" style="background: #8b1227;"></div></div>
        </div>
        <div class="pillar-item">
          <div class="pillar-meta">
            <span>Garanties & Couverture FONGIP</span>
            <strong>{{ subScores.guarantee }}%</strong>
          </div>
          <div class="pillar-track"><div class="pillar-fill" [style.width.%]="subScores.guarantee" style="background: #475569;"></div></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .score-card {
        background: #ffffff;
      }

      .score-main {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .score-ring-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
      }

      .score-ring {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: conic-gradient(var(--ring-color) calc(var(--score) * 1%), #f1f5f9 0);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      .score-inner {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .score-inner strong {
        font-size: 2rem;
        font-weight: 900;
        color: #1a252f;
        line-height: 1;
      }

      .score-inner small {
        font-size: 0.78rem;
        color: #94a3b8;
        font-weight: 600;
      }

      .score-status-tag {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        letter-spacing: 0.03em;
      }

      .score-eyebrow {
        color: #c41e3a;
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: block;
        margin-bottom: 0.25rem;
      }

      .score-title {
        color: #1a252f;
        font-weight: 800;
        font-size: 1.15rem;
        margin-bottom: 0.35rem;
      }

      .score-desc {
        color: #64748b;
        font-size: 0.88rem;
        line-height: 1.5;
        margin: 0;
      }

      .score-pillars {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .pillar-meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        margin-bottom: 0.25rem;
      }

      .pillar-meta span {
        color: #475569;
        font-weight: 600;
      }

      .pillar-meta strong {
        color: #1a252f;
      }

      .pillar-track {
        height: 6px;
        background: #f1f5f9;
        border-radius: 999px;
        overflow: hidden;
      }

      .pillar-fill {
        height: 100%;
        border-radius: 999px;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `,
  ],
})
export class ScoreGaugeComponent {
  @Input() score = 78
  @Input() title = 'Score de bancabilité'
  @Input() description = 'Profil recevable par les banques PME et plusieurs institutions de microfinance.'
  @Input() subScores = { financial: 82, compliance: 90, guarantee: 60 }

  get color(): string {
    if (this.score >= 75) return '#c41e3a' // Rouge bancable
    if (this.score >= 55) return '#8b1227' // Bordeaux modéré
    return '#64748b' // Ardoise à structurer
  }

  get riskLabel(): string {
    if (this.score >= 75) return 'Bancable · Risque faible'
    if (this.score >= 55) return 'Eligible · Garanties à joindre'
    return 'En structuration'
  }
}

@Component({
  selector: 'app-dossier-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dossier-stepper">
      @for (step of steps; track step; let i = $index) {
        <div class="dossier-step" [class.done]="i < activeIndex" [class.current]="i === activeIndex">
          <span>{{ i + 1 }}</span>
          <p>{{ step }}</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .dossier-stepper {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .dossier-step {
        border: 1px solid #e5eaf3;
        border-radius: 8px;
        padding: 0.8rem;
        min-height: 86px;
        background: #fff;
      }

      .dossier-step span {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: inline-grid;
        place-items: center;
        background: #f1eeee;
        color: #64748b;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .dossier-step p {
        margin: 0;
        font-size: 0.78rem;
        color: #475569;
      }

      .dossier-step.done span,
      .dossier-step.current span {
        background: #dd241d;
        color: #fff;
      }

      .dossier-step.current {
        border-color: #c41e3a;
        box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.15);
      }

      @media (max-width: 768px) {
        .dossier-stepper {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class DossierStepperComponent {
  @Input() activeIndex = 2
  steps = dossierSteps
}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center py-5">
      <div class="empty-icon mx-auto mb-3">
        <i [class]="icon"></i>
      </div>
      <h5>{{ title }}</h5>
      <p class="text-muted mb-0">{{ description }}</p>
    </div>
  `,
  styles: [
    `
      .empty-icon {
        width: 72px;
        height: 72px;
        display: grid;
        place-items: center;
        border-radius: 8px;
        background: #fdeceb;
        color: #dd241d;
        font-size: 2rem;
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() title = 'Aucune donnee'
  @Input() description = 'Les informations apparaitront ici.'
  @Input() icon = 'iconoir-folder'
}
