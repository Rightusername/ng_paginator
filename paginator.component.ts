import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.less']
})
export class PaginatorComponent implements OnInit, AfterViewInit {

    @Input() customLinkFunction;
    @Input() initPage;
    @Input() pages;

    @Output() changePage = new EventEmitter<number>();

    count;
    curpage = 1;
    numbers;

    pager: any = {};
    perpage = 20;
    pagedItems: any[];
    pagersize = 7;
    init = true;

    constructor(
        public location: Location
    ) {
    }

    ngOnInit() {
        if (this.initPage) {
            this.curpage = this.initPage;
        }
        this.setPage(this.curpage);
        const params: any = {};
        params.name = 2;
    }

    ngAfterViewInit() {

    }

    makeQueryLink(page) {
        if (this.customLinkFunction) {
            return this.customLinkFunction();
        }
        let s = this.location.path().replace(/page\/\d{1,}/, `page/${page}`);
        // s = s.replace(/page=\d{1,}/, '');
        if (!s.match(/page\/\d{1,}/)) {
            if (s.match(/\/*\?/)) {
                s = s.replace(/\/*\?/gi, `/page/${page}?`);
            } else {
                if (s[s.length - 1] == '/') {
                    s.substring(-1);
                }
                s = s + `/page/${page}`;
            }
            if (s[s.length - 1] == '?') {
                s.substring(-1);
            }
        }
        return s;
    }

    pagerLink(e) {
        e.preventDefault();
    }


    setPage(page: number) {
        // get pager object from service
        this.curpage = page;
        this.pager = this.getPager(this.count, page);

        // get current page of items
    }

    _changePage(page) {
        this.curpage = page;
        this.pager = this.getPager(this.count, page);

    }

    changePageBtn(page) {
        if (this.curpage == page) {
            return;
        }
        this.curpage = page;
        this.pager = this.getPager(this.count, page);
        this.changePage.emit(this.curpage);
    }

    getPager(totalItems: number, currentPage: number = 1, pageSize: number = this.perpage) {
        // calculate total pages
        let totalPages = this.pages;

        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let startPage: number, endPage: number;
        if (totalPages <= this.pagersize) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= Math.ceil((this.pagersize - 1) / 2) + 1) {
                startPage = 1;
                endPage = 7;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - this.pagersize - 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - Math.ceil((this.pagersize - 1) / 2);
                endPage = currentPage + Math.floor((this.pagersize - 1) / 2);
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

}
