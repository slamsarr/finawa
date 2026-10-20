import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { environment } from '../../environment'
import { Partner } from '../data/finawa-platform.data'

@Injectable({
  providedIn: 'root',
})
export class PartnerApiService {
  private apiUrl = `${environment.apiUrl}/partners`

  constructor(private http: HttpClient) {}

  readActive(): Observable<Partner[]> {
    return this.http.get<any[]>(`${this.apiUrl}/active`).pipe(
      map((data) =>
        data.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          zones: item.zoneNames || [],
          sectors: item.sectorNames || [],
          score: item.score || 0,
          description: item.description || '',
          conditions: item.conditions || '',
          pricing: item.pricing || '',
          userId: item.userId,
          minAmount: item.minAmount,
          maxAmount: item.maxAmount,
          minDurationMonths: item.minDurationMonths,
          maxDurationMonths: item.maxDurationMonths,
          interestRate: item.interestRate,
          active: item.active,
        }))
      ),
      catchError(() => of([]))
    )
  }

  readByType(type: string): Observable<Partner[]> {
    return this.http.get<any[]>(`${this.apiUrl}/type/${type}`).pipe(
      map((data) =>
        data.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          zones: item.zoneNames || [],
          sectors: item.sectorNames || [],
          score: item.score || 0,
          description: item.description || '',
          conditions: item.conditions || '',
          pricing: item.pricing || '',
          userId: item.userId,
          minAmount: item.minAmount,
          maxAmount: item.maxAmount,
          minDurationMonths: item.minDurationMonths,
          maxDurationMonths: item.maxDurationMonths,
          interestRate: item.interestRate,
          active: item.active,
        }))
      ),
      catchError(() => of([]))
    )
  }
}
