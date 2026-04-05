import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJSNS from 'sockjs-client';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [
        FormsModule,
        NgForOf,
        NgIf
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {

    @Input() localisation: string = '';

    isOpen = true;
    draft = '';
    messages: Array<{ author: string; text: string; time: string; mine: boolean }> = [];

    SockJSCtor: any = (SockJSNS as any).default ?? (SockJSNS as any);
    stompClient: any = null;
    private currentRoom: string | null = null;
    private readonly websocketUrl = 'http://localhost:8080/gs-guide-websocket';

    private get currentUsername(): string {
        return this.authService.getUser()?.username ?? 'anonymous';
    }

    constructor(private readonly authService: AuthService) {}

    ngOnInit(): void {
            this.connectToRoom();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['localisation'] && !changes['localisation'].firstChange) {
            this.connectToRoom();
        }
    }

    ngOnDestroy(): void {
        this.disconnect();
    }

    toggleChat(): void {
        this.isOpen = !this.isOpen;
    }

    private getRoomKey(): string {
        return encodeURIComponent(this.localisation.trim() || 'general');
    }

    private connectToRoom(): void {
        const room = this.getRoomKey();

        if (this.currentRoom === room && this.stompClient?.connected) {
            return;
        }

        this.disconnect();
        this.currentRoom = room;
        this.stompClient = Stomp.over(new this.SockJSCtor(this.websocketUrl));

        this.stompClient.connect({}, () => {
            this.stompClient.subscribe(`/topic/message/${room}`, (msg: any) => {
                const payload = this.parseIncomingMessage(msg.body);
                if (!payload) {
                    return;
                }

                if (this.messages.length > 4) {
                    this.messages.shift();
                }
                this.messages.push({
                    author: payload.author,
                    text: payload.text,
                    time: new Date().toLocaleTimeString(),
                    mine: payload.author === this.currentUsername
                });
            });
        });
    }

    private parseIncomingMessage(raw: string): { author: string; text: string } | null {
        try {
            const parsed = JSON.parse(raw);
            const author = (parsed?.author ?? '').toString().trim() || 'anonymous';
            const text = (parsed?.text ?? '').toString().trim();

            if (!text) {
                return null;
            }

            return { author, text };
        } catch {
            const text = raw?.toString().trim();
            if (!text) {
                return null;
            }
            return { author: 'anonymous', text };
        }
    }

    private disconnect(): void {
        if (this.stompClient) {
            try {
                this.stompClient.disconnect?.(() => undefined);
            } catch {
                // ignore disconnect errors when reconnecting rapidly
            }
        }
    }

    sendMessage(): void {
        const text = this.draft.trim();
        if (!text) {
            return;
        }
        const room = this.getRoomKey();
        const payload = JSON.stringify({
            author: this.currentUsername,
            text
        });
        this.stompClient?.send(`/app/chat/${room}`, { 'content-type': 'application/json' }, payload);
        this.draft = '';
    }
}
