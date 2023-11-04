import {
  Map,
  MapLayers,
  MapMarkerLayer,
  MapMarkerLayerTooltip,
  MapTileLayer,
  MarkerTooltipContext,
  PanEndEvent,
  TileUrlTemplateArgs,
  ZoomEndEvent,
} from "@progress/kendo-react-map";
import React, { useEffect } from "react";
import styles from "./../css/page.module.css";
import {
  MapComponentProps,
  childrenItemsField,
  latLongField,
} from "../services/context";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { extendDataItem } from "@progress/kendo-react-data-tools";

export const MapComponent = (props: MapComponentProps) => {
  const [currentPostion, setCurrentPosition] = React.useState<
    [number, number] | null
  >(null);
  const [zoom, setMapZoom] = React.useState<number>(5);

  useEffect(() => {
    if (!currentPostion) {
      navigator.geolocation.getCurrentPosition((res) => {
        setCurrentPosition([res.coords.latitude, res.coords.longitude]);
      });
    }
  });
  const attribution =
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap contributors</a>';

  const tileSubdomains = ["a", "b", "c"];
  const tileUrl = (e: TileUrlTemplateArgs) => {
    return `https://${e.subdomain}.tile.openstreetmap.org/${e.zoom}/${e.x}/${e.y}.png`;
  };

  const renderMarkerTooltip = (props: MarkerTooltipContext) => (
    <div className={styles.toolTip}>
      <span>{props.dataItem.name}</span>
      <span>{props.dataItem.description}</span>
      <span>{props.dataItem.latitude}</span>
      <span>{props.dataItem.longitude}</span>
      <span>{props.dataItem.make}</span>
      <span>{props.dataItem.model}</span>
    </div>
  );
  const setCurrentZoom = React.useCallback(
    (event: ZoomEndEvent) => {
      setMapZoom(zoom + event.originalEvent.delta);
    },
    [zoom]
  );
  const mapPanEnded = React.useCallback((event: PanEndEvent) => {
    setCurrentPosition([event.center.lat, event.center.lng]);
  }, []);

  return (
    <ErrorBoundary
      errorComponent={(props) => {
        console.log(props);
        return <div>Something went wrong</div>;
      }}
    >
      <Map
        center={currentPostion || [0, 0]}
        zoom={zoom}
        style={{
          overflow: "auto",
          height: "100%",
        }}
        onZoomEnd={setCurrentZoom}
        onPanEnd={mapPanEnded}
      >
        <MapLayers>
          <MapTileLayer
            urlTemplate={tileUrl}
            subdomains={tileSubdomains}
            attribution={attribution}
          />
          <MapMarkerLayer
            data={props.renderedData.map((item) =>
              extendDataItem(item, childrenItemsField, {
                [latLongField]: [item.latitude, item.longitude],
              })
            )}
            locationField="latLongField"
            titleField="name"
          >
            <MapMarkerLayerTooltip render={renderMarkerTooltip} />
          </MapMarkerLayer>
        </MapLayers>
      </Map>
    </ErrorBoundary>
  );
};
