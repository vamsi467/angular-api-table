import { PercentPipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { TableRowComponent } from './../table-row/table-row.component';
import { LoadingIndicatorModule } from '@pcs/components-lib';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Configuration } from './../../../../../../core/src/lib/models/configuration';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ConfigService } from './../../../services/config.service';
import { OrderCodeService } from '@pcs/core-lib';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRowGroupComponent } from './table-row-group.component';

describe('TableRowGroupComponent', () => {
  let component: TableRowGroupComponent;
  let fixture: ComponentFixture<TableRowGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, BrowserModule, FormsModule, HttpClientModule, LoadingIndicatorModule],
      declarations: [TableRowComponent, TableRowGroupComponent],
      providers: [OrderCodeService, ConfigService,
        {
          provide: Configuration,
          useValue: {}
        },
        CurrencyPipe,
        PercentPipe]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRowGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
