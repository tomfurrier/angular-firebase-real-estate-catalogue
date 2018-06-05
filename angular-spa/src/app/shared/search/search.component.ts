import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { RealEstateType } from '../../real-estate/real-estate-type';
import { SearchService } from './search.service';
import { SearchFilter } from './searchFilter.model';

@Component({
  selector: 'app-real-estate-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  realEstateTypes = RealEstateType;
  searchForm: FormGroup;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      realEstateType: new FormControl(''),
      addressText: new FormControl(''),
      minPrice: new FormControl(''),
      maxPrice: new FormControl('')
    });
  }

  onSearch() {
    this.searchService.search(this.searchForm.value);
  }

  onTypeFilterChange(value) {
    this.searchService.setTypeFilter(value);
  }

  onAddressChange(value) {
    this.searchService.setAddressFilter(value);
  }

  onMinPriceChange(value) {
    this.searchService.setMinPriceFilter(value);
  }

  onMaxPriceChange(value) {
    this.searchService.setMaxPriceFilter(value);
  }

  onIntentChange(value) {
    this.searchService.setIntentFilter(value);
  }
}
