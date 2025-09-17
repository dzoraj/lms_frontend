import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { UpsertDTO } from '../../model/supplies/upsert-dto.model';

export interface FacultySupplyDTO {
  id: number;
  facultyId: number;
  itemName: string;
  quantity: number;
  updatedAt: string;
}

export type OrderStatus = 'PLACED' | 'APPROVED' | 'DENIED' | 'RECEIVED';

export interface SupplyOrderDTO {
  id: number;
  facultyId: number;
  itemName: string;
  quantity: number;
  status: OrderStatus;
  createdAt: string;
}

@Component({
  selector: 'app-faculty-supplies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-supplies.component.html',
  styleUrls: ['./faculty-supplies.component.css']
})
export class FacultySuppliesComponent implements OnInit {
  facultyId: number | null = null;

  supplies: FacultySupplyDTO[] = [];
  orders: SupplyOrderDTO[] = [];

  loadingSupplies = false;
  loadingOrders = false;
  errorSupplies = '';
  errorOrders = '';

  supplyForm: UpsertDTO = { facultyId: 0, itemName: '', quantity: 1 };
  addMap: Record<number, number> = {};

  orderForm = { itemName: '', quantity: 1 };

  constructor(private ds: DynamicService, private http: HttpClient) {}

  ngOnInit(): void {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  load(): void {
    if (!this.facultyId || this.facultyId <= 0) return;
    this.loadSupplies();
    this.loadOrders();
  }

  loadSupplies(): void {
    if (!this.facultyId) return;
    this.loadingSupplies = true;
    this.errorSupplies = '';
    this.ds.getByPath<FacultySupplyDTO[]>(`faculty-supplies?facultyId=${this.facultyId}`)
      .subscribe({
        next: r => { this.supplies = r ?? []; this.loadingSupplies = false; },
        error: _ => { this.errorSupplies = 'Failed to load supplies'; this.loadingSupplies = false; }
      });
  }

  loadOrders(): void {
    if (!this.facultyId) return;
    this.loadingOrders = true;
    this.errorOrders = '';
    this.ds.getByPath<SupplyOrderDTO[]>(`supply-orders?facultyId=${this.facultyId}`)
      .subscribe({
        next: r => { this.orders = r ?? []; this.loadingOrders = false; },
        error: _ => { this.errorOrders = 'Failed to load orders'; this.loadingOrders = false; }
      });
  }

  submitSupply(): void {
    if (!this.facultyId || this.facultyId <= 0) return;
    if (!this.supplyForm.itemName?.trim() || !this.supplyForm.quantity || this.supplyForm.quantity <= 0) return;
    this.supplyForm.facultyId = this.facultyId;
    this.ds.create<UpsertDTO>('faculty-supplies', this.supplyForm)
      .subscribe({
        next: _ => { this.supplyForm.itemName = ''; this.supplyForm.quantity = 1; this.loadSupplies(); },
        error: _ => { this.errorSupplies = 'Failed to save supply'; }
      });
  }

  addMore(row: FacultySupplyDTO): void {
    const addQuantity = this.addMap[row.id] ?? 0;
    if (!addQuantity || addQuantity <= 0) return;
    const url = `http://localhost:8080/api/faculty-supplies/${row.id}/add`;
    this.http.patch<FacultySupplyDTO>(url, { addQuantity }, { headers: this.authHeaders() })
      .subscribe({
        next: _ => { this.addMap[row.id] = 0; this.loadSupplies(); },
        error: _ => { this.errorSupplies = 'Failed to add quantity'; }
      });
  }

  placeOrder(): void {
    if (!this.facultyId || this.facultyId <= 0) return;
    if (!this.orderForm.itemName?.trim() || !this.orderForm.quantity || this.orderForm.quantity <= 0) return;
    const body = { facultyId: this.facultyId, itemName: this.orderForm.itemName.trim(), quantity: this.orderForm.quantity };
    this.ds.create<typeof body>('supply-orders', body)
      .subscribe({
        next: _ => { this.orderForm.itemName = ''; this.orderForm.quantity = 1; this.loadOrders(); },
        error: _ => { this.errorOrders = 'Failed to place order'; }
      });
  }

  setOrderStatus(o: SupplyOrderDTO, status: OrderStatus): void {
    const url = `http://localhost:8080/api/supply-orders/${o.id}/status`;
    this.http.patch<SupplyOrderDTO>(url, { status }, { headers: this.authHeaders() })
      .subscribe({
        next: _ => { this.loadOrders(); if (status === 'RECEIVED') this.loadSupplies(); },
        error: _ => { this.errorOrders = 'Failed to update order'; }
      });
  }
}
