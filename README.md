# ng2-webapp

本项目是以[angular-cli](https://github.com/angular/angular-cli)为基础，适用于移动web的项目。

# 包含的功能

* 1.[rem 布局](#rem-布局)：在根组件调用rem.service，动态计算html的font-size
* 2.[下拉刷新](#下拉加载)：在父组件插入refresh组件,利用output传输数据
* 3.[轮播回弹](#轮播回弹)：carousel组件，自定义轮播间隔，高和宽以及传入的数据
* 4.[封装http请求](#封装的http请求)：所有的请求都从这里走，以便加公共参数或者做加密操作
* 5.[路由中请求(resolver)](resolver就是一个service)：在进入页面前获取数据
* 6.请求代理配置：项目根目录下proxy.conf.json中配置
* 7.图片懒加载，使用[ng-lazyload-image](https://github.com/tjoskar/ng-lazyload-image)
* 8.[storage](#storage)：本地存储
* 9.使用gulp运行dist内代码，在api.service中设置

# 项目结构说明
>app<br/>
>--animation 转场动画，来自大漠穷秋老师的nicefish<br/>
>--component 公共组件，使用前要在模块引入component.mudule<br/>
>&nbsp;&nbsp;--carousel 回弹轮播<br/>
>&nbsp;&nbsp;--footer 底部<br/>
>&nbsp;&nbsp;--header 头部里面的内容采用内嵌模式，样式需要在父组件写<br/>
>&nbsp;&nbsp;--refresh 下拉加载<br/>
>--directive 不多说了，angularjs中已有的概念<br/>
>--guard 路由守卫(service)，最新的angular-cli已将此独立出来，可以单独生成<br/>
>--home 项目的home模块<br/>
>--product 项目的product模块<br/>
>--service 公共服务，在根模块引入service.module即可<br/>

# 使用方法

> 注意： TS内该引入的引入，不在示例中提及<br/>
> package.json配置：<br/>
"start": "ng serve --proxy-config proxy.conf.json --host 192.168.1.29 --port 80"<br/>
> host 为本机IP,port为端口<br/>
> npm start 后，手机在同局域网下可访问该IP<br/>

### rem 布局
在根组件调用一次就行。
```javascript
this.rem.setDpr();
window.onresize = () => {
  this.rem.setDpr();
};
```

### 下拉刷新

* html
```html
<app-refresh [url]="'/api/index/index'" [method]="'get'" [body]="body" (onReceive)="receiveTheData($event)">
  <!--url: 请求地址-->
  <!--method：请求方法-->
  <!--body：请求参数-->
  <!--(onReceive)="receiveTheData($event)"：父组件绑定的事件-->
  <!--class="refresh-content"为组件内嵌tag，不可删除-->
  <div class="refresh-content">
    <!--在这里放入需加载数据的html结构-->
    <div *ngFor="let item of list;let idx = index"></div>
  </div>
</app-refresh>
  ```
* TS
```javascript
export class FindComponent implements OnInit {
  list;
  body = {
    appId: 11,
    page: 1
  };
  receiveTheData(action) {
    // 从loader组件返回action
    this.list = action.hotProducts; //返回赋值
  }
  constructor(
  ) { };

  ngOnInit() {
  }
}

```

### 轮播回弹

* html
```html
<app-carousel [data]="topCarousel" [interval]="3000" [height]="7.31" [width]="10" *ngIf="topCarousel">
</app-carousel>
<!--data：元素为对象的数组，内部实现需根据接口更改-->
<!--interval：轮播间隔时间，单位为毫秒-->
<!--height：高度,单位rem-->
<!--width：宽度,单位rem-->
```

### resolver，就是一个service
* 路由配置
```javascript
{ 
  path: 'product',
  component: ProductIndexComponent,
  data: {
    api: '/api/product/list', // 接口地址
    body: { // 接口参数
      type: 1,
      page: 1,
      pageCount: 10
    }
  },
  resolve: {
    content: ResolverService // 对应的服务
  }
},
```
* TS
```javascript
export class ProductIndexComponent implements OnInit {
  title;
  detail;
  constructor( 
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe(res => {
        this.detail = res['content'];
        this.title = res['title'];
      });
  }

}
```
### 封装的http请求
* TS
```javascript
export class ProductIndexComponent implements OnInit {
  constructor( 
    private api: ApiService
  ) { }

  ngOnInit() {
    // Promise
    this.api
      .ajax({
        method: 'get',
        url: 'api/index/appinfo',
        body: {
          // 参数
        }
      })
      .toPromise()
      .then(res => {
        // do something
      });
    
    // 可观察者对象
    this.api
      .ajax({
        method: 'get',
        url: 'api/index/appinfo',
        body: {
          // 参数
        }
      })
      .subscribe(res => {
        // do something
      });
  }

}
```

### storage

* TS
```javascript
export class ProductIndexComponent implements OnInit {
  constructor( 
    private storage: StorageService
  ) { }

  ngOnInit() {
    // 存放
    this.storage.put({
      type: 'localStorage', // 也可以是sessionStorage
      key: 'appinfo',
      data: [
        // ...
      ]
    });
    // 获取
    this.storage.get('appinfo');
    // 移除
    this.storage.remove('appinfo,id');
    // 清空
    this.storage.remove(); // 清空localStorage和sessionStorage
  }

}
```
