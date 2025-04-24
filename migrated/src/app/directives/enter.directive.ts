import { Directive, HostListener, ElementRef } from '@angular/core';

// app.directive('enter', [function () {
//   return {
//       scope: {
//           enter: "@"
//       },
//       link: function (scope, element, attrs) {
//           element.keyup(function (e) {
//               if (e.keyCode == 13) {
//                   var inputs = $("input:enabled,textarea:enabled,select:enabled");
//                   var nextElementIndex;

//                   for (var i = 0; i < inputs.length; i++) {
//                       if (inputs[i] == element[0]) {
//                           nextElementIndex = i + 1;
//                           break;
//                       }
//                   }

//                   if (e.altKey) {
//                       for (var i = nextElementIndex; i < inputs.length; i++) {
//                           if (inputs[i].getAttribute("type") == "button") {
//                               inputs[i].focus();
//                               inputs[i].click();
//                               break;
//                           }
//                       }
//                   }
//                   else {
//                       var inputType;
//                       inputType = inputs[nextElementIndex].getAttribute("type");
//                       inputs[nextElementIndex].focus();

//                       if (inputType == "button")
//                           inputs[nextElementIndex].click();
//                       else if (inputType == "text")
//                           inputs[nextElementIndex].select();
//                   }
//               }
//           });
//       }
//   };
// }]);

@Directive({
	selector: '[enter]'
})
export class EnterDirective {

	constructor(private _element: ElementRef) { }

	@HostListener('keyup', ['$event'])
	onKeyup(e) {
		if (e.keyCode === 13) {
			const inputs = document.querySelectorAll<HTMLElement>("input:enabled,textarea:enabled,select:enabled");
			let nextElementIndex;

			for (let i = 0; i < inputs.length; i++) {
				if (inputs[i] === this._element.nativeElement) {
					if (i === inputs.length - 1) {
						//当前元素已经是最后一个元素
						return;
					}
					nextElementIndex = i + 1;
					break;
				}
			}

			if (e.altKey) {
				for (let i = nextElementIndex; i < inputs.length; i++) {
					if (inputs[i].getAttribute("type") == "button") {
						inputs[i].focus();
						inputs[i].click();
						break;
					}
				}
			}
			else {
				var inputType;
				inputType = inputs[nextElementIndex].getAttribute("type");
				inputs[nextElementIndex].focus();

				if (inputType == "button")
					inputs[nextElementIndex].click();
				else if (inputType == "text")
					(<HTMLInputElement>inputs[nextElementIndex]).select();
			}
		}
	}
}
