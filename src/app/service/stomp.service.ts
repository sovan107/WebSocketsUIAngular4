import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

interface Config {

    // websocket endpoint
    host: string;

    // optional headers
    headers?: Object;

    // heartbeats (ms)
    heartbeatIn?: number;
    heartbeatOut?: number;

    // debuging
    debug?: boolean;

    // reconnection time (ms)
    recTimeout?: number;

}


@Injectable()
export class StompService {

    config = null;

    private socket: any;

    stomp: any;

    private timer: any;

    private connectionPromise: any;
    private resolveConPromise: (...args: any[]) => void;

    private disconnectPromise: any;
    private resolveDisConPromise: (...args: any[]) => void;

    status: string;


    constructor() {

        this.status = 'CLOSED';

        // Create promises
        this.connectionPromise = new Promise(
            (resolve, reject) => this.resolveConPromise = resolve,
        );
        this.disconnectPromise = new Promise(
            (resolve, reject) => this.resolveDisConPromise = resolve,
        );
    }


	/**
	 * Configure
	 */
    configure(config: Config): void {
        this.config = config;
    }


	/**
	 * Try to establish connection to server
	 */
    startConnect(): Promise<{}> {

        if (this.config === null) {
            throw Error('Configuration required!');
        }

        this.status = 'CONNECTING';

        // Prepare Client
        this.socket = new SockJS(this.config.host);
        this.stomp = Stomp.over(this.socket);

        this.stomp.heartbeat.outgoing = this.config.heartbeatOut || 10000;
        this.stomp.heartbeat.incoming = this.config.heartbeatIn || 10000;

        // Debuging connection
        if (this.config.debug) {
            this.stomp.debug = function (str) {
                console.dir(str);
            };
        } else {
            this.stomp.debug = false;
        }

        // Connect to server
        this.stomp.connect(this.config.headers || {}, this.onConnect, this.onError);
        return this.connectionPromise;

    }


	/**
	 * Successfull connection to server
	 */
    onConnect = (frame: any) => {
        this.status = 'CONNECTED';
        this.resolveConPromise();
        this.timer = null;
    }

	/**
	 * Unsuccessfull connection to server
	 */
    onError = (error: string) => {

        console.error(`Error: ${error}`);

        // Check error and try reconnect
        if (error.indexOf('Lost connection') !== -1) {
            if (this.config.debug) {
                console.dir('Reconnecting...');
            }
            this.timer = setTimeout(() => {
                this.startConnect();
            }, this.config.recTimeout || 5000);
        }
    }

	/**
	 * Subscribe 
	 */
    subscribe(destination: string, callback: any, headers?: Object) {
        headers = headers || {};
        return this.stomp.subscribe(destination, function (response) {
            const message = JSON.parse(response.body);
            headers = response.headers;
            callback(message, headers);
        }, headers);
    }

	/**
	 * Unsubscribe
	 */
    unsubscribe(subscription: any) {
        subscription.unsubscribe();
    }


	/**
	 * Send 
	 */
    send(destination: string, body: any, headers?: Object): void {
        const message = JSON.stringify(body);
        headers = headers || {};
        this.stomp.send(destination, headers, message);
    }


	/**
	 * Disconnect stomp
	 */
    disconnect(): Promise<{}> {
        this.stomp.disconnect(() => { this.resolveDisConPromise(); this.status = 'CLOSED'; });
        return this.disconnectPromise;
    }
}