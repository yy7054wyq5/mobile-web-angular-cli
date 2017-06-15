import { Router, ActivatedRoute } from '@angular/router';
import { flyIn } from './../../share/animation/fly-in';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-find-component',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.less'],
  animations: [flyIn]
})
export class FindComponent implements OnInit {
  findData: any;
  defaultImage = 'assets/lazy_default.png';
  body = {
    page: 1
  };
  appTag: string = window['appTag'];

  refreshData(action: Array<object>) {
    this.findData = action;
  }

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router
  ) { };

  ngOnInit() {
    if (this.router.url === '/' + window['appTag'] + '/index') {
      this.router.navigate(['/' + window['appTag'] + '/index/find']);
    }
    this.activeRoute.data
      .subscribe(res => {
        this.findData = res.content;
      });
  }
}
