import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from '@/environment'

export interface Dossier {
  id?: number
  reference?: string
  enterpriseId?: number
  enterpriseName?: string
  needTypeId?: number
  needTypeName?: string
  amount: number
  durationMonths: number
  purpose: string
  status?: string
  score?: number
  submissionDate?: string
  nextAction?: string
  description?: string
  caValid?: boolean
  nineaProvided?: boolean
  guaranteeComplete?: boolean
  createdDate?: string
  modifiedDate?: string
  entrepreneur?: string
  type?: string
  createdAt?: string
  turnover?: number
  financialInstrument?: string
  breakdown?: any
  formData?: any
  isDraft?: boolean
  expertNotes?: string
  lastExportedAt?: string
  formCompleteness?: number
}

export interface DossierCreateRequest {
  enterpriseId?: number
  needTypeId?: number
  amount: number
  durationMonths: number
  purpose: string
  description?: string
  caValid?: boolean
  nineaProvided?: boolean
  guaranteeComplete?: boolean
  formData?: any
  isDraft?: boolean
}

export interface DossierUpdateRequest {
  id: number
  enterpriseId?: number
  needTypeId?: number
  amount?: number
  durationMonths?: number
  purpose?: string
  description?: string
  status?: string
  score?: number
  nextAction?: string
  caValid?: boolean
  nineaProvided?: boolean
  guaranteeComplete?: boolean
  formData?: any
  isDraft?: boolean
  expertNotes?: string
}

@Injectable({
  providedIn: 'root',
})
export class DossierService {
  private apiUrl = `${environment.apiRootUrl || environment.apiUrl}/dossiers`

  constructor(private http: HttpClient) {}

  create(request: DossierCreateRequest): Observable<Dossier> {
    return this.http.post<any>(this.apiUrl, request).pipe(
      map((res) => (res && res.payload ? res.payload : res))
    )
  }

  update(request: DossierUpdateRequest): Observable<Dossier> {
    return this.http.put<any>(this.apiUrl, request).pipe(
      map((res) => (res && res.payload ? res.payload : res))
    )
  }

  read(id: number): Observable<Dossier> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((res) => (res && res.payload ? res.payload : res))
    )
  }

  readByReference(reference: string): Observable<Dossier> {
    return this.http.get<any>(`${this.apiUrl}/reference/${reference}`).pipe(
      map((res) => (res && res.payload ? res.payload : res))
    )
  }

  readAll(params?: any): Observable<Dossier[]> {
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((res) => (res && res.payload ? res.payload : (Array.isArray(res) ? res : [])))
    )
  }

  readByEnterprise(enterpriseId: number): Observable<Dossier[]> {
    return this.http.get<any>(`${this.apiUrl}/enterprise/${enterpriseId}`).pipe(
      map((res) => (res && res.payload ? res.payload : (Array.isArray(res) ? res : [])))
    )
  }

  readByStatus(status: string): Observable<Dossier[]> {
    return this.http.get<any>(`${this.apiUrl}/status/${status}`).pipe(
      map((res) => (res && res.payload ? res.payload : (Array.isArray(res) ? res : [])))
    )
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  submit(id: number): Observable<Dossier> {
    return this.http.post<any>(`${this.apiUrl}/${id}/submit`, {}).pipe(
      map((res) => (res && res.payload ? res.payload : res))
    )
  }

  updateStatus(id: number, status: string): Observable<Dossier> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      map((res) => (res && res.payload ? res.payload : res))
    )
  }

  exportCep(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/export-cep`, {
      responseType: 'blob'
    })
  }

  saveFormData(id: number, data: any, isDraft = false): Observable<Dossier> {
    return this.http.post<any>(`${this.apiUrl}/${id}/form`, data, {
      params: { isDraft: String(isDraft) }
    }).pipe(
      map((res) => (res && res.payload ? res.payload : res))
    )
  }

  getFormData(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/form`).pipe(
      map((res) => (res && res.payload ? res.payload : res))
    )
  }

  updateExpertNotes(id: number, notes: string): Observable<Dossier> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/expert-notes`, { notes }).pipe(
      map((res) => (res && res.payload ? res.payload : res))
    )
  }
}

