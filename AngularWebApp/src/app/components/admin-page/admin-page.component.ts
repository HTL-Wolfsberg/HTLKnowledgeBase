import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';
import { UserService } from '../../services/user.service';

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
  userFilterCtrl: FormControl = new FormControl();
  filteredUsers: Observable<UserModel[]>;
  private _allUsers: UserModel[] = [];
  private _filteredUsers$ = new BehaviorSubject<UserModel[]>([]);

  roles: string[] = ['Admin', 'Editor'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private userService: UserService
  ) {
    this.filteredUsers = this._filteredUsers$.asObservable();
  }

  ngOnInit(): void {
    this.assignRoleForm = this.fb.group({
      user: ['', []] as (UserModel | never[])[],
      roles: [[], []]
    });

    this.userService.getUsers().subscribe(users => {
      this._allUsers = users;
      this._filteredUsers$.next(users);
    });

    this.userFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUsers(value))
      )
      .subscribe(filtered => {
        this._filteredUsers$.next(filtered);
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
        next => {
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
}
