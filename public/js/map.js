
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    zoom: 9,
    center: listing.geometry.coordinates || [77.2088,28.6139] //(longitude,latitude)
});

const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset:25})
.setHTML(`<h5 class="mb-0"><b>${listing.location}</b></h5><small>Exact location will be provided after booking</small>`))
.addTo(map);