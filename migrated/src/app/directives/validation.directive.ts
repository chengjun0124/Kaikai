import { Directive, Input } from '@angular/core';
import { AbstractControl, FormGroupName, AbstractFormGroupDirective, ControlContainer, FormArray, FormControl } from '@angular/forms';

@Directive({
  selector: '[validation]',
  exportAs: 'validation',
})
export class ValidationDirective {
  @Input() formControlName;
  @Input() formArrayName;
  private _control: AbstractControl;

  constructor(private _formGroupName: ControlContainer) { }

  ngOnInit(): void {
    if (this.formControlName) {
      this._control = this._formGroupName.control.get(this.formControlName);
    } 
    else {
      this._control = this._formGroupName.control;
    }
  }

  get invalid() {
    return this._control.invalid;
  }

  getError(...errorCodes: string[]) {
    const errorCode = errorCodes.find(code => this._control.getError(code));
    return errorCode ? this._control.getError(errorCode) : null;
  }

  get value() {
    return this._control.value;
  }

  get controls() {
    return (<FormArray>this._control).controls;
  }

  getControl<T extends AbstractControl>(): T {
    return <T>this._control;
  }
}