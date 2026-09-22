import { Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { NumeralPipe } from '../numeral.pipe';

const DEFAULT_PAGE_SIZE = 50;

@Component({
   selector: 'app-paginator',
   templateUrl: './paginator.html',
   styleUrls: ['./paginator.scss'],
   providers: [NumeralPipe]
})
export class PaginatorComponent implements OnInit {
   @HostBinding('class') get className(): string { return 'app-paginator'; }
   @Input() count = 0;
   @Input() page = 0;
   @Input() showFirstLastButtons = true;
   @Output() pageChange = new EventEmitter<PageEvent>();
   @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
   displayedPageSizeOptions: number[] = [];
   menuOpened = false;
   private pageSize = 0;
   private currentPageSizeOptions: number[] = [50, 100, 150, 200];

   constructor(private numeral: NumeralPipe) { }

   ngOnInit(): void {
      this.updateDisplayedPageSizeOptions();
   }

   @Input()
   get size(): number { return this.pageSize; }
   set size(value: number) {
      this.pageSize = value < 0 ? 0 : value;
      this.updateDisplayedPageSizeOptions();
   }

   @Input()
   get pageSizeOptions(): number[] { return this.currentPageSizeOptions; }
   set pageSizeOptions(value: number[]) {
      this.currentPageSizeOptions = value || [];
      this.updateDisplayedPageSizeOptions();
   }

   nextPage(): void {
      if (!this.hasNextPage()) { return; }

      const previousPageIndex = this.page;
      this.page++;
      this.emitPageEvent(previousPageIndex);
   }

   previousPage(): void {
      if (!this.hasPreviousPage()) { return; }

      const previousPageIndex = this.page;
      this.page--;
      this.emitPageEvent(previousPageIndex);
   }

   firstPage(): void {
      if (!this.hasPreviousPage()) { return; }

      const previousPageIndex = this.page;
      this.page = 0;
      this.emitPageEvent(previousPageIndex);
   }

   lastPage(): void {
      if (!this.hasNextPage()) { return; }

      const previousPageIndex = this.page;
      this.page = this.getNumberOfPages() - 1;
      this.emitPageEvent(previousPageIndex);
   }

   hasPreviousPage(): boolean {
      return this.page >= 1 && this.size !== 0;
   }

   hasNextPage(): boolean {
      const maxPageIndex = this.getNumberOfPages() - 1;
      return this.page < maxPageIndex && this.size !== 0;
   }

   getNumberOfPages(): number {
      if (!this.size) {
         return 0;
      }
      return Math.ceil(this.count / this.size);
   }

   _changePageSize(pageSize: number): void {
      const startIndex = this.page * this.size;
      const previousPageIndex = this.page;

      this.page = Math.floor(startIndex / pageSize) || 0;
      this.size = pageSize;
      this.emitPageEvent(previousPageIndex);
   }

   _nextButtonsDisabled(): boolean {
      return !this.hasNextPage();
   }

   _previousButtonsDisabled(): boolean {
      return !this.hasPreviousPage();
   }

   getRangeLabel(): string {
      if (this.count === 0 || this.size === 0) { return `0 of ${this.count}`; }

      const count = Math.max(this.count, 0);
      const offset = this.page * this.size;
      // If the start index exceeds the list count, do not try and fix the end index to the end.
      const endIndex = offset < count ? Math.min(offset + this.size, count) : offset + this.size;

      const start = this.numeral.transform(offset + 1);
      const last = this.numeral.transform(endIndex);
      const total = this.numeral.transform(this.count);
      return `${start}–${last} of ${total}`;
   }

   hasMore(): boolean {
      return this.displayedPageSizeOptions.length > 1 && this.count >= this.displayedPageSizeOptions[0];
   }

   clickItemPerPage(): void {
      if (this.hasMore()) {
         this.menuTrigger.openMenu();
      }
   }

   delayClose(): void {
      setTimeout(() => { this.menuOpened = false; }, 100);
   }

   private updateDisplayedPageSizeOptions(): void {
      if (!this.size) {
         this.pageSize = this.pageSizeOptions.length > 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
      }

      this.displayedPageSizeOptions = this.pageSizeOptions.slice();

      if (this.displayedPageSizeOptions.indexOf(this.size) === -1) {
         this.displayedPageSizeOptions.push(this.size);
      }

      this.displayedPageSizeOptions.sort((a, b) => a - b);
   }

   private emitPageEvent(previousPageIndex: number): void {
      this.pageChange.emit({
         previousPageIndex,
         pageIndex: this.page,
         pageSize: this.size,
         length: this.count
      });
   }
}
