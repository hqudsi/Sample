import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, Inject, ViewChildren, ElementRef, QueryList, ViewChild } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IonContent, IonList, IonSlides } from '@ionic/angular';
import { isPlatform } from '@ionic/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit, AfterViewInit {

  data = null;

  opts = {
    freeMode: true,
    slidesPerView: 2.6,
    slidesOffsetBefore: 30,
    slidesOffsetAfter: 100
  };

  categorySlidesVisible = false;

  activeCategory = 0;
  @ViewChildren(IonList, { read: ElementRef }) lists: QueryList<ElementRef>;
  listElements = [];
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild(IonContent) content: IonContent;

  constructor(
      private http: HttpClient,
      @Inject(DOCUMENT) private document: Document
    ) { }

  ngOnInit() {
    // StatusBar.setStyle({ style: Style.Light });
    // StatusBar.setOverlaysWebView({ overlay: true });
    this.http.get('https://devdactic.fra1.digitaloceanspaces.com/foodui/1.json').subscribe((res: any) => {
      console.log(res);
      this.data = res;
    });
    // Set the header position for sticky slides
    // const headerHeight = isPlatform('ios') ? 44 : 56;
    // const headerHeight = isPlatform('ios') ? 44 : 56;
    // this.document.documentElement.style.setProperty('--header-position', `calc(env(safe-area-inset-top) + ${headerHeight}px)`);
    // const toolbarPadding = isPlatform('ios') ? 0 : 15;
    // this.document.documentElement.style.setProperty('--toolbar-padding', `calc(env(safe-area-inset-top) + ${toolbarPadding}px)`);
  }

  ngAfterViewInit() {
    this.lists.changes.subscribe(_ => {
      this.listElements = this.lists.toArray();
    });
  }

  selectCategory(index) {
    const child = this.listElements[index].nativeElement;
    this.content.scrollToPoint(0, child.offsetTop - 120, 1000);
  }

  // Listen to ion-content scroll output
  // Set currently visible active section
  onScroll(ev) {
    const offset = ev.detail.scrollTop;
    this.categorySlidesVisible = offset > 500;

    for (let i = 0; i < this.listElements.length; i++) {
      const item = this.listElements[i].nativeElement;
      if (this.isElementInViewport(item)) {
        this.activeCategory = i;
        // this.slides.slideTo(i, 100);
        this.slides.slideTo(i);
        break;
      }
    }
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

}
