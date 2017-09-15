import { StompService } from './../../service/stomp.service';
import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'user',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.scss']
})
export class UserComponent implements OnInit {

    private subscription: any;
    constructor(private stompService: StompService) { }

    ngOnInit() {
        this.subscription = this.stompService
            .subscribe(`/topic/product`, this.response);
    }

    response = (data) => {
        console.dir(data);
    }
}
