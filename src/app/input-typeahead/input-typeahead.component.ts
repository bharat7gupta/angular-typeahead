import { Component, OnInit, ElementRef, Input, forwardRef, ViewChild, ViewChildren, QueryList, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { fromEvent } from 'rxjs/observable/fromEvent';
import { ajax } from 'rxjs/observable/dom/ajax';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";

declare var $: any;

// combo-box to select from a list of items
@Component({
  selector: 'input-typeahead',
  templateUrl: './input-typeahead.component.html',
  styleUrls: ['./input-typeahead.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputTypeaheadComponent),
            multi: true
        }
    ],
    host: {
        '(document:click)': 'onClickOutside($event)'
    }
})
export class InputTypeaheadComponent implements OnInit, AfterViewChecked {
    _list: any[] = [];

    tempCurrent: any; // the highlighted element
    searchTerm: string; // the search text in the text-part of the combobox
    showList: boolean; // boolean to determine if the list needs to be shown

    typeahead: Observable<any>;

    @Input() // the complete list of possible values
    set list(value: any) {
        this._list = value || [];
        
        if(this._list.length > 0) {
            this.showList = true;
            this.tempCurrent = this._list[0];
        }
    }

    @Input() invalid: boolean; // indicates if the selected data is invalid
    @Input() displayFieldName: string; // the field to be used for display
    @Input() valueFieldName: string; // the field to be used for value comparison

    @Output() search: EventEmitter<string> = new EventEmitter<string>(); // event emitted for each new search input
    @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>(); // event emitted for each new search input
  
    @ViewChild("searchBox") searchBox: ElementRef;
    @ViewChild("list") listEl: ElementRef;
    @ViewChildren("listItemEls") listItemEls: QueryList<ElementRef>;

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {

        this.typeahead = fromEvent(this.searchBox.nativeElement, 'input').pipe(
            map((e: any) => e.target.value),
            debounceTime(200),
            distinctUntilChanged()
        );

        this.typeahead.subscribe(() => {
            this.search.emit(this.searchTerm);
        });
    }
    
    ngAfterViewChecked() {
        if(this.showList && this.listEl) {
            let elementToFocus = this.listItemEls.find((listItem, i, array) => {
                return listItem.nativeElement.className.indexOf("active") >= 0;
            });

            let viewableWindow = {
                start: this.listEl.nativeElement.scrollTop,
                end: this.listEl.nativeElement.scrollTop + this.listEl.nativeElement.offsetHeight
            };
            let itemOffset = {
                start: elementToFocus.nativeElement.offsetTop,
                end: elementToFocus.nativeElement.offsetTop + elementToFocus.nativeElement.offsetHeight
            };

            // scroll if item is not already within viewable window
            if(itemOffset.end > viewableWindow.end) {
                this.listEl.nativeElement.scrollTop += itemOffset.end - viewableWindow.end + 5;
            } 
            else if(viewableWindow.start > itemOffset.start) {
                this.listEl.nativeElement.scrollTop -= viewableWindow.start - itemOffset.start + 5;
            }
        }
    }

    clearInput() {
        this.searchTerm = "";
        this.searchBox.nativeElement.focus();
        this.showList = false;
    }

    // saves the item selected by user
    setValue(value) {
        this.showList = false;
        this.tempCurrent = null;
        this.searchTerm = "";
        this.valueChanged.emit(value);
    }

    // Helps in navigation through the list
    navigateList(event) {
        event.preventDefault();
        event.stopPropagation();
        if(event.keyCode === 27) { // Esc key
            this.showList = false;
        }
        else if(event.keyCode === 38) { // arrow up
            this.showList && this.moveCurrentIndex("up");
        }
        else if(event.keyCode === 40) { // arrow down
            if(this.showList)
                this.moveCurrentIndex("down");
            else
                this.searchTerm = "";
        }
    }

    // handles tab events
    handleKeyDown(event) {
        if(event.keyCode === 9 || event.keyCode === 13) { // select item on tab or enter key
            this.setValue(this.tempCurrent);
            setTimeout(() => this.showList = false, 200);
        }
    }

    // Hides the list if the user clicks outside of the component
    onClickOutside(event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showList = false;
        }
    }

    isActive(listItem) {
        return this.tempCurrent && this.getValue(this.tempCurrent)===this.getValue(listItem);
    }

    private getValue(t) {
        return this.valueFieldName ? t[this.valueFieldName] : t;
    }

    // get index of selected item from the available list. search param will be applicable on list, if any
    private getSelectedIndex(): number {
        for(var i=0; i<this._list.length; i++){
            if(this.tempCurrent && this.tempCurrent !== null
                && this.getValue(this.tempCurrent) === this.getValue(this._list[i]))
                return i;
        }
        return -1;
    }

    // Handles navigation through the list on arrow up or arrow down keys
    private moveCurrentIndex(moveDirection) {
        let currentIndex = this.getSelectedIndex();
        let listSize = this._list.length;

        if(currentIndex === -1)
            this.tempCurrent = this._list[0];
        else{
            if(moveDirection === "down")
                currentIndex = (currentIndex + 1) % listSize;
            else
                currentIndex = currentIndex===0 ? listSize-1 : --currentIndex;

            this.tempCurrent = this._list[ currentIndex ];
        }
    }
}