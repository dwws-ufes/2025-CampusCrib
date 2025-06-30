import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  
  @Input() latitude?: number;
  @Input() longitude?: number;
  @Input() isEditable: boolean = false;
  @Input() height: string = '400px';
  @Input() zoom: number = 13;
  
  @Output() locationSelected = new EventEmitter<LocationCoordinates>();
  
  private map?: L.Map;
  private marker?: L.Marker;
  private defaultCenter: L.LatLngTuple = [-15.7942, -47.8822]; 
  
  ngOnInit() {
    this.fixLeafletIconPaths();
  }
  
  ngAfterViewInit() {
    this.initializeMap();
  }
  
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
  
  private fixLeafletIconPaths() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
    });
  }
  
  private initializeMap() {
    const center: L.LatLngTuple = (this.latitude && this.longitude) 
      ? [this.latitude, this.longitude] 
      : this.defaultCenter;
    
    this.map = L.map(this.mapContainer.nativeElement).setView(center, this.zoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    
    if (this.latitude && this.longitude) {
      this.addMarker(this.latitude, this.longitude);
    }
    
    if (this.isEditable) {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }
  }
  
  private addMarker(lat: number, lng: number) {
    if (this.marker) {
      this.map?.removeLayer(this.marker);
    }
    
    this.marker = L.marker([lat, lng]).addTo(this.map!);
  }
  
  private onMapClick(lat: number, lng: number) {
    this.addMarker(lat, lng);
    this.locationSelected.emit({ latitude: lat, longitude: lng });
  }
  
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          this.map?.setView([lat, lng], this.zoom);
          
          if (this.isEditable) {
            this.onMapClick(lat, lng);
          } else {
            this.addMarker(lat, lng);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }
}
