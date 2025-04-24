import { FormGroup, AbstractControl, FormArray, FormControl } from "@angular/forms";

export class BasePage {
    form: FormGroup;
    private _getFormControl<T extends AbstractControl>(formControlName: string): T {
        if (!this.form)
            return null;
            
        let returnVal: AbstractControl = null;
        formControlName.split('.').forEach((name) => {
            if (returnVal === null) {
                returnVal = this.form;
            }
            
            const match = /(.*)\[(\d+)\]$/.exec(name);
            if(!match) {
                returnVal = returnVal.get(name);
            }
            else {
                returnVal = (<FormArray>returnVal.get(match[1])).controls[match[2]];
            }
        });
        return <T>returnVal;
    }

    getFormArray(formControlName: string | Array<string>): FormArray {
        if (!this.form)
            return null;
        return <FormArray>this.form.get(formControlName);
    }

    getFormControl(formControlName: string | Array<string>): FormControl {
        if (!this.form)
            return null;
        return <FormControl>this.form.get(formControlName);
    }

    getFormControlValue<T>(formControlName: string | Array<string>): T {
        if(this.form) {
            return <T>this.form.get(formControlName).value;
        }
        return null;
    }

    // getFormControlPendingValue<T>(formControlName: string): T {
    //     return <T>this._getFormControl(formControlName)['_pendingValue'];
    // }

    setFormControlValue<T>(formControlName: string | Array<string>, value: T) {
        this.form.get(formControlName).setValue(value);
    }

    // setFormControlValueWithoutValidation(_elementRef: ElementRef, formControlName: string, value: string) {
    //     _elementRef.nativeElement.value = value
    //     this._getFormControl(formControlName)['_pendingChange'] = true;
    //     this._getFormControl(formControlName)['_pendingDirty'] = true;
    //     this._getFormControl(formControlName)['_pendingTouched'] = true;
    //     this._getFormControl(formControlName)['_pendingValue'] = value;
    // }
}