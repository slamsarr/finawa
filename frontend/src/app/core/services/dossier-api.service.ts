import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { environment } from '../../environment'
import { Dossier } from '../data/finawa-platform.data'

@Injectable({
  providedIn: 'root',
})
export class DossierApiService {
  private apiUrl = `${environment.apiUrl}/dossiers`

  constructor(private http: HttpClient) {}

  readAll(params?: any): Observable<Dossier[]> {
    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      map((data) =>
        data.map((item) => ({
          id: item.id,
          reference: item.reference,
          entrepreneur: item.enterpriseName || 'Unknown',
          type: this.mapNeedTypeToDossierType(item.needTypeName),
          amount: item.amount,
          score: item.score || 0,
          status: item.status as any,
          createdAt: item.createdDate || item.submissionDate,
          nextAction: item.nextAction || '',
          enterpriseId: item.enterpriseId,
          needTypeId: item.needTypeId,
          durationMonths: item.durationMonths,
          purpose: item.purpose,
          description: item.description,
          caValid: item.caValid,
          nineaProvided: item.nineaProvided,
          guaranteeComplete: item.guaranteeComplete,
        }))
      ),
      catchError(() => of([]))
    )
  }

  readByEnterprise(enterpriseId: number): Observable<Dossier[]> {
    return this.http.get<any[]>(`${this.apiUrl}/enterprise/${enterpriseId}`).pipe(
      map((data) =>
        data.map((item) => ({
          id: item.id,
          reference: item.reference,
          entrepreneur: item.enterpriseName || 'Unknown',
          type: this.mapNeedTypeToDossierType(item.needTypeName),
          amount: item.amount,
          score: item.score || 0,
          status: item.status as any,
          createdAt: item.createdDate || item.submissionDate,
          nextAction: item.nextAction || '',
          enterpriseId: item.enterpriseId,
          needTypeId: item.needTypeId,
          durationMonths: item.durationMonths,
          purpose: item.purpose,
          description: item.description,
          caValid: item.caValid,
          nineaProvided: item.nineaProvided,
          guaranteeComplete: item.guaranteeComplete,
        }))
      ),
      catchError(() => of([]))
    )
  }

  private mapNeedTypeToDossierType(needTypeName?: string): 'Financement' | 'Accompagnement' | 'Investissement' {
    if (!needTypeName) return 'Financement'
    const name = needTypeName.toLowerCase()
    if (name.includes('financement') || name.includes('credit')) return 'Financement'
    if (name.includes('accompagnement') || name.includes('conseil')) return 'Accompagnement'
    if (name.includes('investissement') || name.includes('capital')) return 'Investissement'
    return 'Financement'
  }
}
