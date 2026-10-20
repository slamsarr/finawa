import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap'
import { forkJoin } from 'rxjs'
import { PermissionService, ProfileService } from '@openapi/services'
import { Feature, Permission, Profile, ProfileCreateRequest, ProfileUpdateRequest } from '@openapi/models'
import { ToastService } from '@utils/toast.service'

interface PermissionGroup {
  feature: Feature,
  permissions: (Permission & { selected: boolean })[]
  allSelected: boolean
}

@Component({
  selector: 'app-profiles-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule, RouterLink],
  templateUrl: './profiles-permissions.component.html',
})
export class ProfilesPermissionsComponent implements OnInit {
  private profileService = inject(ProfileService)
  private permissionService = inject(PermissionService)
  private modalService = inject(NgbModal)
  private toastService = inject(ToastService)

  profiles: Profile[] = []
  features: Feature[] = []
  allPermissions: Permission[] = []

  selectedProfile: Profile | null = null
  permissionGroups: PermissionGroup[] = []
  assignedPermissionNames = new Set<string>()

  searchProfile = ''
  searchPermission = ''
  selectedFeature = ''
  loading = false
  savingPermissions = false
  newProfile: ProfileCreateRequest = { name: '', description: '' }
  editProfile: { id: number; name: string; description: string } = { id: 0, name: '', description: '' }
  savingProfile = false

  profileToDelete: Profile | null = null

  ngOnInit() {
    forkJoin({
      profiles: this.profileService.readAllProfile({
        searchParams: {},
        pageable: { page: 0, size: 2000, sort: ['name'] },
      }),
      permissions: this.permissionService.readAllPermissions(),
      features: this.permissionService.readAllFeatures(),
    }).subscribe(({ profiles, permissions, features }) => {
      this.profiles = profiles.payload ?? []
      this.allPermissions = permissions.payload ?? []
      this.features = features.payload ?? []
    })
  }

  get filteredProfiles(): Profile[] {
    if (!this.searchProfile.trim()) return this.profiles
    const s = this.searchProfile.toLowerCase()
    return this.profiles.filter(
      p => p.name?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s),
    )
  }

  selectProfile(profile: Profile) {
    this.loading = true
    this.profileService.readProfile({ profileId: profile.id! }).subscribe({
      next: res => {
        this.selectedProfile = res.payload ?? null
        this.assignedPermissionNames = new Set(this.extractPermissionNames(res.payload?.permissions!))
        this.buildGroups()
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  private extractPermissionNames(permissions?: Array<Permission | string>): string[] {
    if (!permissions || !permissions.length) return []
    return permissions
      .map(p => (typeof p === 'string' ? p : p?.type ?? ''))
      .filter(t => t.length > 0)
  }

  buildGroups() {
    const assigned = this.assignedPermissionNames
    let perms = [...this.allPermissions]

    if (this.selectedFeature) {
      perms = perms.filter(p => p.feature?.type === this.selectedFeature)
    }
    if (this.searchPermission.trim()) {
      const s = this.searchPermission.toLowerCase()
      perms = perms.filter(
        p => p.description?.toLowerCase().includes(s) || p.type?.toLowerCase().includes(s),
      )
    }

    const featureMap = new Map<string, PermissionGroup>()
    perms.forEach(p => {
      const key = p.feature?.type ?? "GENERAL";
      if (!featureMap.has(key)) {
        featureMap.set(key, {
          feature: p.feature!,
          permissions: [],
          allSelected: false,
        })
      }
      featureMap.get(key)!.permissions.push({ ...p, selected: assigned.has(p.type!) })
    })

    this.permissionGroups = Array.from(featureMap.values()).map(g => ({
      ...g,
      allSelected: g.permissions.length > 0 && g.permissions.every(p => p.selected),
    }))
  }

  onFilterChange() {
    if (this.selectedProfile) this.buildGroups()
  }

  onPermissionToggle(name: string, selected: boolean) {
    if (selected) this.assignedPermissionNames.add(name)
    else this.assignedPermissionNames.delete(name)
  }

  toggleAll(group: PermissionGroup, checked: boolean) {
    group.permissions.forEach(p => {
      p.selected = checked
      this.onPermissionToggle(p.type!, checked)
    })
    group.allSelected = checked
  }

  updateGroupAll(group: PermissionGroup) {
    group.allSelected = group.permissions.every(p => p.selected)
  }

  savePermissions() {
    if (!this.selectedProfile?.id) return
    this.savingPermissions = true

    const selectedPerms = Array.from(this.assignedPermissionNames)

    const body: ProfileUpdateRequest = {
      id: this.selectedProfile.id,
      name: this.selectedProfile.name!,
      description: this.selectedProfile.description!,
      permissionNames: selectedPerms,
    }
    this.profileService.updateProfile({
      profileId: this.selectedProfile.id,
      body: body,
    }).subscribe({
      next: res => {
        this.selectedProfile = res.payload ?? this.selectedProfile
        this.assignedPermissionNames = new Set(selectedPerms)
        this.buildGroups()
        this.savingPermissions = false
        this.toastService.showSuccess('Permissions enregistrées avec succès !')
      },
      error: (err) => {
        this.savingPermissions = false
        const msg = err?.error?.message ?? 'Erreur lors de la sauvegarde des permissions'
        this.toastService.showError(msg)
      },
    })
  }

  openNewProfileModal(content: unknown) {
    this.newProfile = { name: '', description: '' }
    this.modalService.open(content, { centered: true })
  }

  openEditProfileModal(content: unknown, profile?: Profile) {
    const target = profile ?? this.selectedProfile
    if (!target?.id) return
    this.editProfile = {
      id: target.id,
      name: target.name ?? '',
      description: target.description ?? '',
    }
    this.modalService.open(content, { centered: true })
  }

  saveEditProfile(modal: { close: () => void }) {
    if (!this.editProfile.name?.trim() || !this.editProfile.description?.trim()) {
      this.toastService.showError('Le nom et la description sont obligatoires')
      return
    }

    this.savingProfile = true
    // Determine existing permissions to preserve
    let perms: string[] = []
    if (this.selectedProfile?.id === this.editProfile.id) {
      perms = Array.from(this.assignedPermissionNames)
    } else {
      const match = this.profiles.find(p => p.id === this.editProfile.id)
      perms = this.extractPermissionNames(match?.permissions ?? [])
    }

    const body: ProfileUpdateRequest = {
      id: this.editProfile.id,
      name: this.editProfile.name.trim(),
      description: this.editProfile.description.trim(),
      permissionNames: perms,
    }

    this.profileService.updateProfile({
      profileId: this.editProfile.id,
      body: body,
    }).subscribe({
      next: res => {
        this.savingProfile = false
        modal.close()
        this.toastService.showSuccess('Profil mis à jour avec succès !')

        // Update local list
        const idx = this.profiles.findIndex(p => p.id === this.editProfile.id)
        if (idx !== -1 && res.payload) {
          this.profiles[idx] = res.payload
        }
        if (this.selectedProfile?.id === this.editProfile.id && res.payload) {
          this.selectedProfile = res.payload
          // Rebuild permission groups with updated profile name/description
          this.buildGroups()
        }
      },
      error: (err) => {
        this.savingProfile = false
        const msg = err?.error?.message ?? 'Erreur lors de la mise à jour du profil'
        this.toastService.showError(msg)
      },
    })
  }

  saveNewProfile(modal: { close: () => void }) {
    if (!this.newProfile.name?.trim() || !this.newProfile.description?.trim()) {
      return
    }

    this.profileService.createProfile({ body: this.newProfile }).subscribe({
      next: () => {
        modal.close()
        this.toastService.showSuccess('Profil créé avec succès !')
        this.profileService.readAllProfile({
          searchParams: {},
          pageable: { page: 0, size: 200, sort: ['name'] },
        }).subscribe(res => {
          this.profiles = res.payload ?? []
        })
      },
    })
  }

  confirmDelete(content: unknown, profile: Profile) {
    this.profileToDelete = profile
    this.modalService.open(content, { centered: true, size: 'sm' }).result.then(
      () => this.profileService.deleteProfile({ profileId: profile.id! }).subscribe(() => {
        this.profiles = this.profiles.filter(p => p.id !== profile.id)
        if (this.selectedProfile?.id === profile.id) {
          this.selectedProfile = null
          this.permissionGroups = []
        }
        this.profileToDelete = null
        this.toastService.showSuccess('Profil supprimé avec succès !')
      }),
      () => { },
    )
  }
}
