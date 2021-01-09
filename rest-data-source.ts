import { EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { PaginatorComponent } from './paginator/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export class RestDataSource<T> implements DataSource<T> {
   changes = new EventEmitter<HttpParams>();
   private readonly dataObservable = new BehaviorSubject<T[]>([]);
   private total = 0;
   private q = '';
   private myFilter?: any;
   private matSort?: MatSort | null;
   private myPaginator?: PaginatorComponent | null;
   private selection = new SelectionModel<T>(true, []);

   connect(): BehaviorSubject<T[]> {
      return this.dataObservable;
   }

   disconnect(): void {
      this.dataObservable.complete();
      this.changes.complete();
   }

   get data(): any { return this.dataObservable.value; }
   get count(): number { return this.total; }

   get filter(): string { return this.q; }
   set filter(s: string) {
      if (this.q === s) { return; }
      this.q = s;
      if (this.myPaginator && this.matSort) {
         this.loadData(true);
      }
   }

   setFilter(filter: any): void {
      this.myFilter = filter;
      if (this.myPaginator && this.matSort) {
         this.loadData(true);
      }
   }

   // get paginator(): Paginator | null { return this._paginator; }
   set paginator(paginator: PaginatorComponent | null) {
      paginator?.pageChange.subscribe(() => this.loadData());
      this.myPaginator = paginator;
   }

  // get sort(): MatSort | null { return this._sort; }
   set sort(sort: MatSort | null) {
      sort?.sortChange.subscribe(() => this.loadData(true));
      this.matSort = sort;
   }

   loadData(resetPage = false): void {
      if (resetPage && this.myPaginator) {
         this.myPaginator.page = 0;
      }
      let params = new HttpParams();
      if (this.q) { params = params.set('q', this.q); }
      if (this.myFilter) {
         for (const key of Object.keys(this.myFilter)) {
            const value = this.myFilter[key];
            params = params.set(key, value);
         }
      }
      if (this.matSort && this.matSort.active && this.matSort.direction) {
         let sort = this.matSort.active;
         if (this.matSort.direction === 'desc') { sort += ',desc'; }
         params = params.set('sort', sort);
      }
      if (this.myPaginator) {
         if (this.myPaginator.size) {
            if (this.myPaginator.page) {
               params = params.set('page', this.myPaginator.page.toString());
            }
            params = params.set('size', this.myPaginator.size.toString());
         }
      }
      this.changes.emit(params);
   }

   loaded(data: any): void {
      if (data.totalElements !== undefined) {
         this.total = data.totalElements;
      }
      this.dataObservable.next(data.content);
      this.selection.clear();
   }

   get selected(): T[] {
      return this.selection.selected;
   }

   hasSelection(): boolean {
      return this.selection.hasValue();
   }

   isSelected(value: T): boolean {
      return this.selection.isSelected(value);
   }

   isAllSelected(): boolean {
      return this.selection.selected.length === this.data.length;
   }

   selectAll(checked: boolean): void {
      if (checked) {
         this.data.forEach((item: T) => this.selection.select(item));
      } else {
         this.selection.clear();
      }
   }

   toggle(value: T): void {
      this.selection.toggle(value);
   }

   removeSelected(): void {
      const data = this.data;
      for (const item of this.selected) {
         const index = data.indexOf(item);
         if (index !== -1) {
            data.splice(index, 1);
         }
      }
      this.total -= this.selected.length;
      this.dataObservable.next(data);
      this.selection.clear();
   }
}
