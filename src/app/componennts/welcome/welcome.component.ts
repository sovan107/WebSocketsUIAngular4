import { StompService } from './../../service/stomp.service';
import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'welcome',
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.scss']
})
export class WelcomeComponent {

    private subscription: any;
    private wsConf = {
        host: `http://localhost:8080/ws`,
        debug: false,
    };

    constructor(private stomp: StompService) {
        this.connectWSServer();
     }
    connectWSServer() {
        this.startStompConnection();
    }

    private startStompConnection() {

        this.stomp.configure(this.wsConf);
        this.stomp.startConnect().then(() => { console.dir(`connected`); });
    }
}
