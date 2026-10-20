import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from '@/environment'

export interface Partner {
  id?: number
  userId?: number
  name: string
  type: string
  description?: string
  conditions?: string
  pricing?: string
  minAmount?: number
  maxAmount?: number
  minDurationMonths?: number
  maxDurationMonths?: number
  interestRate?: number
  score?: number
  active?: boolean
  partnerTypeId?: number
  partnerTypeName?: string
  zoneIds?: number[]
  sectorIds?: number[]
  zoneNames?: string[]
  sectorNames?: string[]
  zones?: string[]
  sectors?: string[]
  processingDays?: number
  approvalRate?: number
  guaranteeRequired?: string
  category?: string
  createdDate?: string
  modifiedDate?: string
}

export interface PartnerCreateRequest {
  userId: number
  name: string
  type: string
  description?: string
  conditions?: string
  pricing?: string
  minAmount?: number
  maxAmount?: number
  minDurationMonths?: number
  maxDurationMonths?: number
  interestRate?: number
  partnerTypeId?: number
  zoneIds: number[]
  sectorIds: number[]
}

export interface PartnerUpdateRequest {
  id: number
  userId?: number
  name?: string
  type?: string
  description?: string
  conditions?: string
  pricing?: string
  minAmount?: number
  maxAmount?: number
  minDurationMonths?: number
  maxDurationMonths?: number
  interestRate?: number
  score?: number
  active?: boolean
  partnerTypeId?: number
  zoneIds?: number[]
  sectorIds?: number[]
}

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  private apiUrl = `${environment.apiUrl}/partners`

  constructor(private http: HttpClient) {}

  create(request: PartnerCreateRequest): Observable<Partner> {
    return this.http.post<any>(this.apiUrl, request).pipe(map((r) => (r?.payload ?? r)))
  }

  update(request: PartnerUpdateRequest): Observable<Partner> {
    return this.http.put<any>(this.apiUrl, request).pipe(map((r) => (r?.payload ?? r)))
  }

  read(id: number): Observable<Partner> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map((r) => (r?.payload ?? r)))
  }

  readByUser(userId: number): Observable<Partner> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`).pipe(map((r) => (r?.payload ?? r)))
  }

  readAll(params?: any): Observable<Partner[]> {
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((r) => (r?.payload ? r.payload : Array.isArray(r) ? r : []))
    )
  }

  readActive(): Observable<Partner[]> {
    return this.http.get<any>(`${this.apiUrl}/active`).pipe(
      map((r) => (r?.payload ? r.payload : Array.isArray(r) ? r : []))
    )
  }

  readByType(type: string): Observable<Partner[]> {
    return this.http.get<any>(`${this.apiUrl}/type/${type}`).pipe(
      map((r) => (r?.payload ? r.payload : Array.isArray(r) ? r : []))
    )
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  activate(id: number): Observable<Partner> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/activate`, {}).pipe(map((r) => (r?.payload ?? r)))
  }

  deactivate(id: number): Observable<Partner> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/deactivate`, {}).pipe(map((r) => (r?.payload ?? r)))
  }
}
