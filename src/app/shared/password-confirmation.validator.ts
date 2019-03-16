import { ValidatorFn, FormGroup } from '@angular/forms';

export const PasswordConfirmationValidator: ValidatorFn = (formGroup: FormGroup) =>  {

    const senha = formGroup.get('password').value;
    const confirmaSenha = formGroup.get('confirmPassword').value;

    if (senha.trim() && confirmaSenha.trim()) {
        return senha  === confirmaSenha ? null : { PasswordConfirmationValidator: true }
    } else {
        return null;
    }
}
