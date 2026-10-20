import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '@/environment'

export interface Matching {
  id?: number
  dossierId: number
  dossierReference?: string
  partnerId: number
  partnerName?: string
  score: number
  matchDate?: string
  status?: string
  amountSuitable?: boolean
  durationSuitable?: boolean
  sectorSuitable?: boolean
  zoneSuitable?: boolean
  notes?: string
  createdDate?: string
}

@Injectable({
  providedIn: 'root',
})
export class MatchingService {
  private apiUrl = `${environment.apiUrl}/matching`

  constructor(private http: HttpClient) {}

  runMatching(dossierId: number): Observable<Matching[]> {
    return this.http.post<Matching[]>(`${this.apiUrl}/dossier/${dossierId}`, {})
  }

  getMatchingForDossier(dossierId: number): Observable<Matching[]> {
    return this.http.get<Matching[]>(`${this.apiUrl}/dossier/${dossierId}`)
  }

  getMatchingForPartner(partnerId: number): Observable<Matching[]> {
    return this.http.get<Matching[]>(`${this.apiUrl}/partner/${partnerId}`)
  }

  updateStatus(matchingId: number, status: string): Observable<Matching> {
    return this.http.patch<Matching>(`${this.apiUrl}/${matchingId}/status`, { status })
  }

  delete(matchingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${matchingId}`)
  }

  clearForDossier(dossierId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/dossier/${dossierId}`)
  }
}
