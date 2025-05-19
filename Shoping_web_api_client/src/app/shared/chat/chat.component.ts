import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  zaloLink: string = 'https://zalo.me/0949477641'; // 

  openZalo(): void {
    window.open(this.zaloLink, '_blank');
  }
}
