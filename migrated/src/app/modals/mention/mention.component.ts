import { Component, OnInit, Inject, EventEmitter, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

// showMention: function (buttonCount, message, state, callback) {
//   //if (!Array.isArray(messageList))
//   //    messageList = [messageList];

//   var mentionHandler = ngDialog.open({
//       template: $rootScope.dialogMentionTemplate,
//       plain: false,
//       showClose: false,
//       closeByEscape: false,
//       overlay: true,
//       className: "ngdialog-theme-mention",
//       closeByDocument: false,
//       controller: ["$scope", function ($scope) {
//           $scope.close = function () {
//               mentionHandler.close();
//               if (state)
//                   routeService.goParams(state);
//           };
//           $scope.confirm = function () {
//               mentionHandler.close();
//               callback();
//               if (state)
//                   routeService.goParams(state);
//           };
//       }],
//       data: { buttonCount: buttonCount, content: message }
//   });
// },

export interface MentionData {
	content: string;
	buttonCount: number;
	onConfirm?(): void;
	commands?: any[]
}

@Component({
	selector: 'mention',
	templateUrl: './mention.component.html',
	styleUrls: ['./mention.component.scss']
})
export class MentionComponent implements OnInit, AfterViewInit {
	content: string;
	@ViewChild('cancel', { static: false }) cancel: MatButton;

	constructor(
		private _dialogRef: MatDialogRef<MentionComponent>,
		@Inject(MAT_DIALOG_DATA) public data: MentionData,
		private _router: Router) { }

	ngOnInit() {
		
	}

	ngAfterViewInit() {
		// console.log(this.cancel);
		// this.cancel.focus();
	}

	confirm() {
		this._dialogRef.close();
		this.data.onConfirm();
		if (this.data.commands)
			this._router.navigate(this.data.commands);
	};

	close() {
		this._dialogRef.close();
		if (this.data.commands)
			this._router.navigate(this.data.commands);
	}
}