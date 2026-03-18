import { Component, OnInit } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJSNS from 'sockjs-client';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [
        FormsModule,
        NgForOf
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
    draft = '';
    messages: Array<{ author: string; text: string; time: string; mine: boolean }> = [];

    SockJSCtor: any = (SockJSNS as any).default ?? (SockJSNS as any);
    stompClient = Stomp.over(new this.SockJSCtor('http://localhost:8080/gs-guide-websocket'));

    ngOnInit(): void {

        this.stompClient.connect({}, () => {
            this.stompClient.subscribe('/topic/message', (msg) => {
                if (this.messages.length > 4) {
                    this.messages.shift();
                }
                this.messages.push({
                    author: 'me',
                    text: msg.body,
                    time: new Date().toLocaleTimeString(),
                    mine: false
                });
            });
        });
    }

    sendMessage(): void {
        const text = this.draft.trim();
        if (!text) {
            return;
        }
        this.stompClient.send('/app/chat', {}, text);
        this.draft = '';
    }
}
