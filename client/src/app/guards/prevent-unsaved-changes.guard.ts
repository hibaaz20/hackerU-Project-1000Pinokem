import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ProfileEditComponent } from '../Edit/CustomerProfileedit/profile-edit/profile-edit.component';

@Injectable({
    providedIn: 'root'
  })
  export class PreventUnsavedChangesGuard implements CanDeactivate<ProfileEditComponent> {
  
    canDeactivate(
      component: ProfileEditComponent): boolean {

      if(component['editForm']?.dirty){
        return confirm("Are you sure you want to continue? any unsaved changes will be lost!")
      }
      return true;
    }
  
  }