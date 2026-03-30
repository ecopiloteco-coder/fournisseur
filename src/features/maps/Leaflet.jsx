import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Leaflet() {
    const mapBasicRef = useRef(null);
    const mapOverlaysRef = useRef(null);
    const mapMarkersCustomRef = useRef(null);
    const mapInteractiveChoroplethRef = useRef(null);

    useEffect(() => {
        if (!window.L) return;

        const L = window.L;
        const maps = [];

        // Fix default marker icon path
        L.Icon.Default.imagePath = '/assets/libs/leaflet/images/';

        // 1. Basic World Map
        const mapBasic = L.map(mapBasicRef.current).setView([51.505, -0.09], 3);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(mapBasic);
        L.marker([51.505, -0.09]).addTo(mapBasic).bindPopup("London");
        maps.push(mapBasic);

        // 2. Map Overlays
        const mapOverlays = L.map(mapOverlaysRef.current).setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(mapOverlays);
        L.marker([51.5, -0.09]).addTo(mapOverlays);
        L.circle([51.508, -0.11], { color: 'red', fillColor: '#f03', fillOpacity: 0.5, radius: 500 }).addTo(mapOverlays);
        maps.push(mapOverlays);

        // 3. Markers Custom
        const mapMarkersCustom = L.map(mapMarkersCustomRef.current).setView([51.5, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapMarkersCustom);
        const LeafIcon = L.Icon.extend({
            options: {
                shadowUrl: '/assets/libs/leaflet/images/leaf-shadow.png',
                iconSize: [38, 95], shadowSize: [50, 64], iconAnchor: [22, 94], shadowAnchor: [4, 62], popupAnchor: [-3, -76]
            }
        });
        const greenIcon = new LeafIcon({ iconUrl: '/assets/libs/leaflet/images/leaf-green.png' });
        L.marker([51.5, -0.09], { icon: greenIcon }).bindPopup('I am a green leaf.').addTo(mapMarkersCustom);
        maps.push(mapMarkersCustom);

        // 4. Interactive Choropleth (US Population)
        if (window.statesData) {
            const mapChoropleth = L.map(mapInteractiveChoroplethRef.current).setView([37.8, -96], 4);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapChoropleth);

            function getColor(d) {
                return d > 1000 ? '#800026' : d > 500 ? '#BD0026' : d > 200 ? '#E31A1C' : d > 100 ? '#FC4E2A' : d > 50 ? '#FD8D3C' : d > 20 ? '#FEB24C' : d > 10 ? '#FED976' : '#FFEDA0';
            }
            function style(feature) {
                return { weight: 2, opacity: 1, color: 'white', dashArray: '3', fillOpacity: 0.7, fillColor: getColor(feature.properties.density) };
            }
            L.geoJson(window.statesData, { style: style }).addTo(mapChoropleth);
            maps.push(mapChoropleth);
        }

        return () => {
            maps.forEach(m => m.remove());
        };
    }, []);

    return (
        <>
            <div className="app-page-head">
                <h1 className="app-page-title">Leaflet</h1>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Leaflet</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Basic World Map</h6>
                        </div>
                        <div className="card-body">
                            <div ref={mapBasicRef} style={{ height: '350px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Map Overlays</h6>
                        </div>
                        <div className="card-body">
                            <div ref={mapOverlaysRef} style={{ height: '350px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Custom Icons</h6>
                        </div>
                        <div className="card-body">
                            <div ref={mapMarkersCustomRef} style={{ height: '350px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Interactive Choropleth</h6>
                        </div>
                        <div className="card-body">
                            <div ref={mapInteractiveChoroplethRef} style={{ height: '350px' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
