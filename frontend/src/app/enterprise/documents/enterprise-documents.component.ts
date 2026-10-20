import { Component, OnInit, inject } from '@angular/core'
import { AsyncPipe, CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import {
  NgbModal,
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { Observable, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectUser } from '@stores/authentication/auth.selector'
import { DocumentService, LabelService } from '@openapi/services'
import {
  ResponseListDocument,
  Document,
  ResponseListLabel,
  DocumentCreateRequest,
  DocumentUpdateRequest,
} from '@openapi/models'
import { ToastService } from '@utils/toast.service'

@Component({
  selector: 'app-enterprise-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    NgbPaginationModule,
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './enterprise-documents.component.html',
})
export class EnterpriseDocumentsComponent implements OnInit {
  private documentService = inject(DocumentService)
  private labelService = inject(LabelService)
  private modalService = inject(NgbModal)
  private sanitizer = inject(DomSanitizer)
  private toastService = inject(ToastService)
  private store = inject(Store)

  userLogin: string | null = null

  documents$: Observable<ResponseListDocument> | null = null
  documentTypes$: Observable<ResponseListLabel> | null = null
  typeFilter = 0
  searchName = ''
  totalElements = 0
  page = 1
  size = 10

  selectedDoc: Document | null = null
  selectedFile: File | null = null
  saving = false

  previewUrl: SafeResourceUrl | null = null
  previewRawUrl: string | null = null
  previewDocName = ''
  previewType: 'image' | 'pdf' | 'other' = 'other'

  ngOnInit() {
    this.store.select(selectUser).subscribe((u) => {
      if (u) {
        this.userLogin = u.login || null
        this.load()
      }
    })
    this.loadTypes()
  }

  loadTypes() {
    this.documentTypes$ = this.labelService.readAllLabel({
      searchParams: { referentialType: 'DOCUMENT_TYPE' },
      pageable: { page: 0, size: 100, sort: ['name'] },
    })
  }

  load() {
    const searchParams: Record<string, string> = {}
    if (this.userLogin) {
      searchParams['owner'] = this.userLogin
    }
    if (this.typeFilter > 0) {
      searchParams['documentTypeId'] = String(this.typeFilter)
    }
    if (this.searchName.trim()) {
      searchParams['name'] = this.searchName.trim()
    }

    this.documents$ = this.documentService
      .readAllDocuments({
        searchParams,
        pageable: { page: this.page - 1, size: this.size, sort: ['name'] },
      })
      .pipe(
        tap((res) => {
          this.totalElements = res.metadata?.totalElements ?? 0
        })
      )
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    this.selectedFile = input.files?.[0] ?? null
    if (this.selectedFile && this.selectedDoc && !this.selectedDoc.name) {
      this.selectedDoc = { ...this.selectedDoc, name: this.selectedFile.name }
    }
  }

  onFilterChange() {
    this.page = 1
    this.load()
  }

  onReset() {
    this.typeFilter = 0
    this.searchName = ''
    this.onFilterChange()
  }

  onPageChange(p: number) {
    this.page = p
    this.load()
  }

  openModal(content: unknown, doc?: Document) {
    this.selectedFile = null
    this.selectedDoc = doc
      ? {
          ...doc,
          documentType: doc.documentType ? { ...doc.documentType } : { id: 0 },
        }
      : {
          name: '',
          description: '',
          documentType: { id: 0 },
        }
    this.modalService.open(content, { centered: true, size: 'lg' })
  }

  save(modal: { close: () => void }) {
    if (!this.selectedDoc?.name?.trim() || !this.selectedDoc.documentType?.id) return
    const isNew = !this.selectedDoc.id
    if (isNew && !this.selectedFile) return

    this.saving = true

    let obs: Observable<unknown>

    if (isNew) {
      const body: DocumentCreateRequest = {
        name: this.selectedDoc.name.trim(),
        description: this.selectedDoc.description ?? '',
        documentTypeId: this.selectedDoc.documentType.id,
      }
      obs = this.documentService.createDocument({
        body: {
          file: this.selectedFile!,
          document: body,
        },
      })
    } else {
      const body: DocumentUpdateRequest = {
        id: this.selectedDoc.id!,
        name: this.selectedDoc.name.trim(),
        description: this.selectedDoc.description ?? '',
        documentTypeId: this.selectedDoc.documentType.id,
      }
      obs = this.documentService.updateDocument({
        documentId: this.selectedDoc.id!,
        body: {
          file: this.selectedFile ?? (undefined as any),
          document: body,
        },
      })
    }

    obs.subscribe({
      next: () => {
        this.saving = false
        this.selectedFile = null
        modal.close()
        this.toastService.showSuccess(
          isNew ? 'Document ajouté avec succès !' : 'Document mis à jour avec succès !'
        )
        this.load()
      },
      error: (err) => {
        this.saving = false
        const msg = err?.error?.message || "Échec de l'enregistrement du document."
        this.toastService.showError(msg)
      },
    })
  }

  downloadDocument(doc: Document) {
    if (!doc.id) return
    this.toastService.showInfo('Téléchargement du document en cours...')
    this.documentService.downloadDocumentFile({ id: doc.id }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = doc.name || 'document'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        this.toastService.showSuccess('Téléchargement terminé !')
      },
      error: (err) => {
        console.error('Download failed', err)
        this.toastService.showError('Échec du téléchargement du fichier.')
      },
    })
  }

  previewDocument(doc: Document, content: unknown) {
    if (!doc.id) return
    this.previewDocName = doc.name!
    this.previewUrl = null
    this.previewRawUrl = null

    this.documentService.downloadDocumentFile({ id: doc.id }).subscribe({
      next: (blob) => {
        const mimeType = blob.type || doc.extension || 'application/octet-stream'
        const typedBlob = new Blob([blob], { type: mimeType })
        const rawUrl = window.URL.createObjectURL(typedBlob)
        this.previewRawUrl = rawUrl
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl)

        if (mimeType.includes('image') || this.isImage(doc)) {
          this.previewType = 'image'
        } else if (mimeType.includes('pdf') || doc.name!.toLowerCase().endsWith('.pdf')) {
          this.previewType = 'pdf'
        } else {
          this.previewType = 'other'
        }

        this.modalService.open(content, { centered: true, size: 'xl' }).result.finally(() => {
          if (this.previewRawUrl) {
            window.URL.revokeObjectURL(this.previewRawUrl)
            this.previewRawUrl = null
            this.previewUrl = null
          }
        })
      },
      error: (err) => {
        console.error('Preview load failed', err)
        this.toastService.showError("Impossible de charger l'aperçu du document.")
      },
    })
  }

  confirmDelete(content: unknown, doc: Document) {
    this.selectedDoc = doc
    this.modalService
      .open(content, { centered: true, size: 'sm' })
      .result.then(
        () =>
          this.documentService.deleteDocument({ documentId: doc.id! }).subscribe({
            next: () => {
              this.toastService.showSuccess('Document supprimé avec succès !')
              this.load()
            },
            error: (err) => {
              const msg = err?.error?.message || 'Échec de la suppression du document.'
              this.toastService.showError(msg)
            },
          }),
        () => {}
      )
  }

  isImage(doc: Document): boolean {
    const ext = (doc.extension ?? '').toLowerCase()
    const name = (doc.name ?? '').toLowerCase()
    return (
      ext.includes('image') ||
      ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some((e) => name.endsWith(e))
    )
  }

  formatFileSize(bytes?: number): string {
    if (!bytes || bytes === 0) return '—'
    const k = 1024
    const sizes = ['Octets', 'Ko', 'Mo', 'Go']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  formatExtension(ext?: string, name?: string): string {
    if (ext) {
      if (ext.includes('/')) {
        const sub = ext.split('/')[1]
        return sub
          .replace('vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx')
          .replace('vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx')
          .replace('vnd.ms-excel', 'xls')
          .replace('msword', 'doc')
          .replace('plain', 'txt')
          .toUpperCase()
      }
      return ext.replace('.', '').toUpperCase()
    }
    if (name && name.includes('.')) {
      return name.split('.').pop()?.toUpperCase() ?? 'FILE'
    }
    return 'DOC'
  }
}
