import { Component, OnInit, inject } from '@angular/core'
import { AsyncPipe, CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterLink } from '@angular/router'
import {
  NgbModal,
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { Observable, tap } from 'rxjs'
import { ProfileService, UserService } from '@openapi/services'
import { ResponseListProfile, ResponseListAdminUser, User, UserUpdateRequest, UserCreateRequest, AdminUser } from '@openapi/models'
import { ToastService } from '@utils/toast.service'

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule, NgbPaginationModule, AsyncPipe, RouterLink],
  templateUrl: './list-users.component.html',
})
export class ListUsersComponent implements OnInit {
  private userService = inject(UserService)
  private profileService = inject(ProfileService)
  private modalService = inject(NgbModal)
  private toastService = inject(ToastService)
  private route = inject(ActivatedRoute)

  users$: Observable<ResponseListAdminUser> | null = null
  profiles$: Observable<ResponseListProfile> | null = null
  totalElements = 0
  page = 1
  size = 10
  search = ''
  activeFilter = ''

  selectedUser: UserUpdateRequest | null = null
  saving = false

  ngOnInit() {
    this.loadProfiles()
    // Read query params from navigation (e.g., from Enterprise list login link)
    this.route.queryParams.subscribe(params => {
      if (params['login']) {
        this.search = params['login']
      }
      this.load()
    })
  }

  loadProfiles() {
    this.profiles$ = this.profileService.readAllProfile({
      searchParams: {},
      pageable: { page: 0, size: 200, sort: ['name'] },
    })
  }

  load() {
    const searchParams: Record<string, string> = {}
    if (this.search.trim()) searchParams['login'] = this.search.trim()
    if (this.activeFilter) searchParams['active'] = this.activeFilter

    this.users$ = this.userService.readAllUser({
      searchParams,
      pageable: { page: this.page - 1, size: this.size, sort: ['login'] },
    }).pipe(tap(res => {
      this.totalElements = res.metadata?.totalElements ?? 0
    }))
  }

  onSearch() {
    this.page = 1
    this.load()
  }

  onReset() {
    this.search = ''
    this.activeFilter = ''
    this.onSearch()
  }


  onPageChange(p: number) {
    this.page = p
    this.load()
  }

  isEdit = false

  openModal(content: unknown, user?: AdminUser) {
    this.isEdit = !!user
    this.selectedUser = user
      ? {
        active: user.active ?? true,
        login: user.login ?? '',
        password: '',
        profileId: user.profile?.id ?? 0,
      }
      : { active: true, login: '', password: '', profileId: 0 }
    this.modalService.open(content, { centered: true, size: 'lg' })
  }

  save(modal: { close: () => void }) {
    if (!this.selectedUser?.login?.trim() || (!this.isEdit && !this.selectedUser.password?.trim()) || !this.selectedUser.profileId) return
    this.saving = true

    let obs: Observable<any>
    if (this.isEdit) {
      const body: UserUpdateRequest = {
        login: this.selectedUser.login.trim(),
        password: this.selectedUser.password?.trim() ? this.selectedUser.password.trim() : (undefined as any),
        profileId: this.selectedUser.profileId,
        active: this.selectedUser.active,
      }
      obs = this.userService.updateUser({ body })
    } else {
      const body: UserCreateRequest = {
        login: this.selectedUser.login.trim(),
        password: this.selectedUser.password?.trim() ?? "",
        profileId: this.selectedUser.profileId,
        active: this.selectedUser.active,
      }
      obs = this.userService.createUser({ body })
    }

    obs.subscribe({
      next: () => {
        this.saving = false
        modal.close()
        this.toastService.showSuccess(
          this.isEdit ? 'Utilisateur mis à jour avec succès !' : 'Utilisateur créé avec succès !'
        )
        this.load()
      },
      error: () => {
        this.saving = false
      },
    })
  }

  toggleActive(user: AdminUser) {
    const obs = user.active
      ? this.userService.deactivateUser({ id: user.id! })
      : this.userService.activateUser({ id: user.id! })
    obs.subscribe({
      next: () => {
        this.toastService.showSuccess(
          user.active ? 'Utilisateur désactivé' : 'Utilisateur activé'
        )
        this.load()
      },
    })
  }

  confirmDelete(content: unknown, user: AdminUser) {
    this.selectedUser = {
      active: user.active ?? false,
      login: user.login ?? '',
      password: '',
      profileId: user.profile?.id ?? 0
    };
    this.modalService.open(content, { centered: true, size: 'sm' }).result.then(
      () => this.userService.deleteUser({ userId: user.id! }).subscribe({
        next: () => {
          this.toastService.showSuccess('Utilisateur supprimé avec succès !')
          this.load()
        },
      }),
      () => { },
    )
  }
}
