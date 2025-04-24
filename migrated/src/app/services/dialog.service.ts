import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MentionComponent, MentionData } from '../modals/mention/mention.component';
import { SyncOrderComponent, SyncOrderData } from '../modals/sync-order/sync-order.component';
import { OrderDTO } from 'src/rest';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private _matDialog: MatDialog) { }

  showMention(content: string, buttonCount: number, onConfirm?: () => void, commands?: any[]) {
    this._matDialog.open<MentionComponent, MentionData>(MentionComponent, {
      width: '500px',
      data: { content: content, buttonCount: buttonCount, onConfirm: onConfirm, commands: commands }
    });
  }

  showSycnOrderDetail(orders: OrderDTO[]) {
    this._matDialog.open<SyncOrderComponent, SyncOrderData>(SyncOrderComponent, {
      data: { orders: orders }
    });
  }
}
