import { Component, inject } from '@angular/core'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { SimplebarAngularModule } from 'simplebar-angular'
import { NgbCollapseModule, NgbCollapse } from '@ng-bootstrap/ng-bootstrap'
import {
  MENU_ITEMS,
  MenuItemType,
  findAllParent,
  findMenuItem,
} from '@utils/menu-items'
import { CommonModule } from '@angular/common'
import { basePath } from '@utils/constants'
import { Store } from '@ngrx/store'
import { selectUser } from '@stores/authentication/auth.selector'
import { MenuBuilderService } from '@utils/menu-builder.service'
import { normalizePersona, personaColors, personaLabels } from '@core/data/finawa-platform.data'

@Component({
  selector: 'app-sidebar',
  imports: [
    SimplebarAngularModule,
    RouterModule,
    NgbCollapseModule,
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styles: ``,
})
export class SidebarComponent {
  menuItems = MENU_ITEMS
  activeMenuItems: string[] = []
  router = inject(Router)
  private store = inject(Store)
  private menuBuilder = inject(MenuBuilderService)
  user$ = this.store.select(selectUser)
  personaColors = personaColors
  personaLabels = personaLabels

  trimmedURL = this.router.url?.replaceAll(
    basePath !== '' ? basePath + '/' : '',
    '/'
  )

  constructor() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.trimmedURL = this.router.url?.replaceAll(
          basePath !== '' ? basePath + '/' : '',
          '/'
        )
        this._activateMenu()
        setTimeout(() => {
          // this.scrollToActive();
        }, 200)
      }
    })
  }

  ngOnInit() {
    this.initMenu()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._activateMenu()
    })
  }

  initMenu(): void {
    this.user$.subscribe((user) => {
      const persona = normalizePersona(user?.profile?.name)
      this.menuItems = this.menuBuilder.build(persona)
      setTimeout(() => this._activateMenu())
    })
  }

  /**
   * toggles open menu
   * @param menuItem clicked menuitem
   * @param collapse collpase instance
   */
  toggleMenuItem(menuItem: MenuItemType, collapse: NgbCollapse): void {
    collapse.toggle()
    let openMenuItems: string[]
    if (!menuItem.collapsed) {
      openMenuItems = [
        menuItem['key'],
        ...findAllParent(this.menuItems, menuItem),
      ]
      const collapseMenuItems = (menu: MenuItemType) => {
        if (menu.subMenu) {
          menu.subMenu.forEach(collapseMenuItems)
        }
        if (!openMenuItems.includes(menu.key!)) {
          menu.collapsed = true
        }
      }

      this.menuItems.forEach(collapseMenuItems)
    }
  }

  _activateMenu(): void {
    const div = document.querySelector('.navbar-nav')
    let matchingMenuItem = null

    if (div) {
      let items: any = div.getElementsByClassName('nav-link')
      for (let i = 0; i < items.length; ++i) {
        if (this.trimmedURL === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute('aria-controls')
        const activeMt = findMenuItem(this.menuItems, mid)

        if (activeMt) {
          const matchingObjs = [
            activeMt['key'],
            ...findAllParent(this.menuItems, activeMt),
          ]

          this.activeMenuItems = matchingObjs

          const collapseMenuItems = (menu: MenuItemType) => {
            if (menu.subMenu) {
              menu.subMenu.forEach(collapseMenuItems)
            }
            menu.collapsed = !matchingObjs.includes(menu.key!)
          }

          this.menuItems.forEach(collapseMenuItems)
        }
      }
    }
  }

  hasSubmenu(menu: MenuItemType): boolean {
    return menu.subMenu ? true : false
  }

  initials(login?: string): string {
    return (login || 'Utilisateur')
      .split(/[.\s_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }

  personaName(profileName?: string): string {
    return this.personaLabels[normalizePersona(profileName)]
  }

  personaColor(profileName?: string): string {
    return this.personaColors[normalizePersona(profileName)]
  }
}
