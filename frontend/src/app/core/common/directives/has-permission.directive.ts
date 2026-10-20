import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core'
import { PermissionService } from '@utils/permission.service'

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef<unknown>)
  private viewContainer = inject(ViewContainerRef)
  private permissionService = inject(PermissionService)
  private hasView = false

  @Input() set appHasPermission(permission: string | string[]) {
    const stream = Array.isArray(permission)
      ? this.permissionService.hasAnyPermission(permission)
      : this.permissionService.hasPermission(permission)

    stream.subscribe((allowed) => {
      if (allowed && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef)
        this.hasView = true
      }
      if (!allowed && this.hasView) {
        this.viewContainer.clear()
        this.hasView = false
      }
    })
  }
}
