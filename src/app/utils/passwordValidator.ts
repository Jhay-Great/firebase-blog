// import built in modules
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// validator fn definition
export const passwordValidator = function():ValidatorFn {
    return (group:AbstractControl):ValidationErrors | null => {
        const password = group.get('password');
        const confirmPassword = group.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { 'passwordMismatch': true };
        }
        
        return null;
    }
}

// ValidatorFn is what we used to create the custom validator function
// AbstractControl represent a form control, form group or form array, in this function it represents the form controls
// ValidatorErrors the validatorFn returns either the error object or null depending if the validation fails or passes