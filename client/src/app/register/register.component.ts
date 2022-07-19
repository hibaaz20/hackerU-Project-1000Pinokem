import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
 
  @Output() cancelRegister = new EventEmitter<boolean>();
  
  registerForm!: FormGroup;
  validationErrors: string[] = [];

  constructor(private accountService: AccountService,
    private toaster: ToastrService,
    private router: Router)
    { }

  ngOnInit(): void {
    this.initializeForm();
  }
  
  initializeForm() {
    
     this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      city: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
      email: new FormControl( '',  [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.email]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')]),
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  register() {
    this.accountService.register(this.registerForm?.value).subscribe(
      (re) => {
        this.router.navigate(['/home']);
        this.cancel();
      },
      error => {
        if(Array.isArray(error)) {
          this.validationErrors = error;
        }
      }
    )

  }

  cancel() {
    this.cancelRegister.emit(false);
  }
  

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value;
      const controlToMatch = (control?.parent as FormGroup)?.controls[matchTo];
      const controlToMatchValue = controlToMatch?.value;
      return controlValue === controlToMatchValue ? null : { isMatching: true };
    }
  }
}
