// admin-page.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../../misc/confirm-dialog/confirm-dialog.component';

interface UserModel {
  id: string;
  email: string;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  assignRoleForm!: FormGroup;
  deleteUserForm!: FormGroup;
  userFilterCtrl: FormControl = new FormControl();
  deleteUserFilterCtrl: FormControl = new FormControl();
  filteredUsers: Observable<UserModel[]>;
  filteredDeleteUsers: Observable<UserModel[]>;
  private _allUsers: UserModel[] = [];
  private _filteredUsers$ = new BehaviorSubject<UserModel[]>([]);
  private _filteredDeleteUsers$ = new BehaviorSubject<UserModel[]>([]);

  roles: string[] = ['Admin', 'Editor'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.filteredUsers = this._filteredUsers$.asObservable();
    this.filteredDeleteUsers = this._filteredDeleteUsers$.asObservable();
  }

  ngOnInit(): void {
    this.assignRoleForm = this.fb.group({
      user: ['', []] as (UserModel | never[])[],
      roles: [[], []]
    });

    this.deleteUserForm = this.fb.group({
      user: ['', []] as (UserModel | never[])[],
    });

    this.userService.getUsers().subscribe(users => {
      this._allUsers = users;
      this._filteredUsers$.next(users);
      this._filteredDeleteUsers$.next(users);
    });

    this.userFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUsers(value))
      )
      .subscribe(filtered => {
        this._filteredUsers$.next(filtered);
      });

    this.deleteUserFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUsers(value))
      )
      .subscribe(filtered => {
        this._filteredDeleteUsers$.next(filtered);
      });

    this.assignRoleForm.get('user')!.valueChanges.subscribe(user => {
      if (user) {
        this.loadUserRoles(user.id);
      }
    });
  }

  private _filterUsers(value: string): UserModel[] {
    const filterValue = value.toLowerCase();
    return this._allUsers.filter(user => user.email.toLowerCase().includes(filterValue));
  }

  compareFn(c1: UserModel, c2: UserModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onSubmit(): void {
    if (this.assignRoleForm.valid) {
      const { user, roles } = this.assignRoleForm.value;
      this.adminService.assignRoles(user.id, roles).subscribe(
        () => {
          this.snackBar.open('Roles assigned successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error => {
          console.error('Error assigning roles', error);
          this.snackBar.open('Error assigning roles', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }

  confirmDelete(): void {
    const user = this.deleteUserForm.get('user')!.value;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete the user with email: ${user.email}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(user.id);
      }
    });
  }

  private deleteUser(userId: string): void {
    this.adminService.deleteUser(userId).subscribe(
      () => {
        this._allUsers = this._allUsers.filter(user => user.id !== userId);
        this._filteredUsers$.next(this._allUsers);
        this._filteredDeleteUsers$.next(this._allUsers);
        this.snackBar.open('User deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error => {
        console.error('Error deleting user', error);
        this.snackBar.open('Error deleting user', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  private loadUserRoles(userId: string): void {
    this.adminService.getUserRoles(userId).subscribe(
      roles => {
        this.assignRoleForm.patchValue({ roles });
      },
      error => {
        console.error('Error loading user roles', error);
      }
    );
  }
}
