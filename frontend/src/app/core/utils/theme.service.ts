import { Injectable, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { BehaviorSubject } from 'rxjs'
import { changetheme } from '@stores/layout/layout-action'

export type ThemeType = 'light' | 'dark'

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private store = inject(Store)
  private readonly THEME_KEY = 'theme'

  private themeSubject = new BehaviorSubject<ThemeType>(this.getStoredTheme())
  public theme$ = this.themeSubject.asObservable()

  get currentTheme(): ThemeType {
    return this.themeSubject.value
  }

  get isDark(): boolean {
    return this.currentTheme === 'dark'
  }

  /**
   * Initializes theme from localStorage and applies to DOM and NgRx store.
   */
  initTheme(): void {
    const savedTheme = this.getStoredTheme()
    this.applyTheme(savedTheme)
  }

  /**
   * Toggle between light and dark mode.
   */
  toggleTheme(): void {
    const nextTheme: ThemeType = this.currentTheme === 'light' ? 'dark' : 'light'
    this.setTheme(nextTheme)
  }

  /**
   * Explicitly set theme.
   */
  setTheme(theme: ThemeType): void {
    localStorage.setItem(this.THEME_KEY, theme)
    this.applyTheme(theme)
  }

  private getStoredTheme(): ThemeType {
    const stored = localStorage.getItem(this.THEME_KEY)
    if (stored === 'dark' || stored === 'light') {
      return stored
    }
    return 'light'
  }

  private applyTheme(theme: ThemeType): void {
    document.documentElement.setAttribute('data-bs-theme', theme)
    this.store.dispatch(changetheme({ color: theme }))
    this.themeSubject.next(theme)
  }
}
