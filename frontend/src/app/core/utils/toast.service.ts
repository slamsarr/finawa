import { Injectable } from '@angular/core'
import Swal, { SweetAlertIcon } from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  },
})

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /**
   * Display a floating toast notification in top-end corner.
   */
  showToast(title: string, icon: SweetAlertIcon = 'success', text?: string) {
    Toast.fire({
      icon,
      title,
      text,
    })
  }

  showSuccess(title: string, text?: string) {
    this.showToast(title, 'success', text)
  }

  showError(title: string, text?: string) {
    this.showToast(title, 'error', text)
  }

  showInfo(title: string, text?: string) {
    this.showToast(title, 'info', text)
  }

  showWarning(title: string, text?: string) {
    this.showToast(title, 'warning', text)
  }

  /**
   * Backward-compatible message method
   */
  showMessage(text: string, ico: SweetAlertIcon) {
    this.showToast(text, ico)
  }

  /**
   * Confirmation dialog (modal)
   */
  async confirmDelete(text: string): Promise<boolean> {
    const result = await Swal.fire({
      title: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
    })
    return result.isConfirmed
  }
}

