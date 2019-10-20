import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  serverUrl = 'http://localhost:8080/socket'
  title = 'LightIT'
  stompClient;
  pressure = 0

  constructor(private http: HttpClient){
    this.initializeWebSocketConnection()
    this.http.post("http://localhost:8080/led/setRefreshRate/200", {}).subscribe();
  }

  initializeWebSocketConnection(){
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws)
    let that = this
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/pressureSubscribe", (message) => {
        that.pressure = Math.round(message.body)
      });
    });
  }
}
