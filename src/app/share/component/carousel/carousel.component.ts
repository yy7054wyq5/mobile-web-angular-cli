import { Router } from '@angular/router';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.less'],
})

export class CarouselComponent implements OnInit, OnDestroy {
  defaultImage = 'assets/lazy_default.png';
  translateLeft: string; // div平移css
  distance: number; // 每次移动的距离
  initTranslateLeft = 0; // 每次移动后记录移动的距离
  limitDistance: number = (10 * window['rem'] / window['dpr']) > 640 ? 640 / 2 : (10 * window['rem'] / window['dpr']) / 2; // 半屏宽度
  pointer = 0; // 小圆点高亮,图片索引
  setIntervalId: any;
  slideTransitionClass = true; // panend和interval时才加过渡效果
  @Input() data: any;
  @Input() interval: number;
  @Input() width: number;
  @Input() height: number;
  @Input() hasLink: boolean;

  limitMove(index: number, move: number) {
    // 头尾只能拉出1/4屏
    if (index === 0 && move >= this.limitDistance / 2) { // 头
      return this.limitDistance / 2;
    } else if (index === this.data.length - 1 && move <= -this.limitDistance / 2) { // 尾
      return -this.limitDistance / 2;
    } else {
      if (move < 0 && move < -this.limitDistance * 2) { // 右移最多一屏
        return - this.limitDistance * 2;
      } else if (move > 0 && move > this.limitDistance * 2) { // 左移最多一屏
        return this.limitDistance * 2;
      }
    }
    return move;
  }

  state(index: number) {
    const slideMove = -index * this.limitDistance * 2;
    this.translateLeft = 'translate3d(' + slideMove + 'px,0px,0px)';
    this.initTranslateLeft = slideMove;
    this.pointer = index;
  }

  panstart() {
    this.slideTransitionClass = false;
    clearInterval(this.setIntervalId);
  }

  panmove(index: number, action: any) {
    this.distance = action.deltaX;
    this.translateLeft = 'translate3d(' + (this.initTranslateLeft + this.limitMove(index, this.distance)) + 'px,0px,0px)';
  }

  panend(index: number, action: any) {
    this.intervalCarousel();
    const MOVE: number = this.limitMove(index, this.distance);
    const MoveRuleWidth: number = this.limitDistance;
    this.slideTransitionClass = true;
    if (index === 0 && MOVE > 0) {
      this.state(0);
    } else if (index === this.data.length - 1 && MOVE < 0) {
      this.state(this.data.length - 1);
    } else {
      if (MOVE > 0 && MOVE < MoveRuleWidth) { // 右移未超过半屏
        this.state(index);
      } else if ((MOVE > 0 && MOVE >= MoveRuleWidth)) { // 右移超过半屏
        this.state(index - 1);
      } else if (MOVE < 0 && MOVE > -MoveRuleWidth) { // 左移未超过半屏
        this.state(index);
      } else if (MOVE < 0 && MOVE <= -MoveRuleWidth) { // 左移超过半屏
        this.state(index + 1);
      }
    }
  }

  swipeleft(index: number, action: any) {
    // console.log('swipeleft');
    if (index === this.data.length - 1) { return; }
    this.state(index + 1);
  }

  swiperight(index: number, action: any) {
    // console.log('swiperight');
    if (index === 0) { return; }
    this.state(index - 1);
  }

  intervalCarousel() {
    this.slideTransitionClass = true;
    let index: number = this.pointer;
    const MAX: number = this.data.length - 1;
    const DIRECTION = { LEFT: 'left', RIGHT: 'right' };
    let direction = 'right';
    if (MAX === 0) { return; } // 一张图片不轮播
    this.setIntervalId = setInterval(() => {
      if (direction === DIRECTION.RIGHT) {
        if (index === MAX) {
          direction = 'left';
          index = index - 1;
        } else {
          index += 1;
        }
        this.state(index);
      } else {
        if (index === 0) {
          direction = 'right';
          index = index + 1;
        } else {
          index -= 1;
        }
        this.state(index);
      }
    }, this.interval);
  }

  toDetail(item: object) {
    if (!this.hasLink) { return; };
    if (item['type'] === 2) {
      window.open(item['url']);
    } else {
      if (item['resourceType'] === 1) {
        console.log(item['resourceId']);
        this.router.navigate(['/product/detail/', item['resourceId']]);
      } else {
        this.router.navigate(['/article/detail/', item['resourceId']]);
      }
    }
  }


  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.intervalCarousel();
  }

  ngOnDestroy() {
    clearInterval(this.setIntervalId);
  }

}
