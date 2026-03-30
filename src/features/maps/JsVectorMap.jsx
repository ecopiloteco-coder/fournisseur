import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function JsVectorMap() {
    const worldMapRef = useRef(null);
    const markerMapRef = useRef(null);
    const linesMapRef = useRef(null);
    const regionMapRef = useRef(null);

    useEffect(() => {
        if (!window.jsVectorMap) return;

        // 1. World Map
        const worldMap = new window.jsVectorMap({
            selector: worldMapRef.current,
            map: "world",
            markers: [
                { name: "Russia", coords: [61.524, 105.3188], style: { initial: { fill: 'var(--bs-danger)' } } },
                { name: "Greenland", coords: [71.7069, -42.6043], style: { initial: { fill: 'var(--bs-success)' } } },
                { name: "United States", coords: [37.0902, -95.7129], style: { initial: { fill: 'var(--bs-primary)' } } }
            ],
            regionStyle: { initial: { fill: 'rgba(200, 200, 200, 0.2)' }, hover: { fill: 'var(--bs-primary)' } },
            zoomButtons: false
        });

        // 2. Marker Map
        const markerMap = new window.jsVectorMap({
            selector: markerMapRef.current,
            map: "world",
            markers: [
                { name: "Brazil", coords: [-14.2350, -51.9253] },
                { name: "China", coords: [35.8617, 104.1954] },
                { name: "Egypt", coords: [26.8206, 30.8025] }
            ],
            markerStyle: { initial: { r: 5, fill: 'var(--bs-secondary)' } },
            regionStyle: { initial: { fill: 'rgba(200, 200, 200, 0.2)' } }
        });

        // 3. Lines Map
        const linesMap = new window.jsVectorMap({
            selector: linesMapRef.current,
            map: "world",
            markers: [
                { name: "Russia", coords: [61.524, 105.3188] },
                { name: "Greenland", coords: [71.7069, -42.6043] }
            ],
            lines: [{ from: 'Russia', to: 'Greenland' }],
            lineStyle: { stroke: 'var(--bs-primary)', animation: true },
            regionStyle: { initial: { fill: 'rgba(200, 200, 200, 0.2)' } }
        });

        // 4. Region Map
        const regionMap = new window.jsVectorMap({
            selector: regionMapRef.current,
            map: "world",
            selectedRegions: ['BR', 'RU', 'US'],
            regionStyle: { initial: { fill: 'rgba(200, 200, 200, 0.2)' }, selected: { fill: 'var(--bs-info)' } }
        });

        return () => {
            // JsVectorMap doesn't have an explicit destroy, but we can clear the containers if needed
            if (worldMapRef.current) worldMapRef.current.innerHTML = '';
            if (markerMapRef.current) markerMapRef.current.innerHTML = '';
            if (linesMapRef.current) linesMapRef.current.innerHTML = '';
            if (regionMapRef.current) regionMapRef.current.innerHTML = '';
        };
    }, []);

    return (
        <>
            <div className="app-page-head">
                <h1 className="app-page-title">JsVectorMap</h1>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">JsVectorMap</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">World Map</h6>
                        </div>
                        <div className="card-body">
                            <div ref={worldMapRef} style={{ height: '350px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Marker Map</h6>
                        </div>
                        <div className="card-body">
                            <div ref={markerMapRef} style={{ height: '350px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Lines Map</h6>
                        </div>
                        <div className="card-body">
                            <div ref={linesMapRef} style={{ height: '350px' }}></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Region Selection</h6>
                        </div>
                        <div className="card-body">
                            <div ref={regionMapRef} style={{ height: '350px' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
