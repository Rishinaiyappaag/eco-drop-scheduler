
declare module 'react-leaflet' {
  import * as L from 'leaflet';
  import * as React from 'react';

  interface MapContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    center: L.LatLngExpression;
    zoom: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
  }

  interface TileLayerProps extends React.HTMLAttributes<HTMLDivElement> {
    attribution: string;
    url: string;
  }

  interface MarkerProps extends React.HTMLAttributes<HTMLDivElement> {
    position: L.LatLngExpression;
  }

  interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {}

  export const MapContainer: React.FC<MapContainerProps>;
  export const TileLayer: React.FC<TileLayerProps>;
  export const Marker: React.FC<MarkerProps>;
  export const Popup: React.FC<PopupProps>;
}
