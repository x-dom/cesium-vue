const Common  = {};
Common.url_root =  "http://192.168.10.212:8002/demo";//springboot server url
// Common.url_root =  "http://192.168.101.107:8002/demo";//springboot server url
Common.url_geoserver =  'http://192.168.10.212:9600/geoserver/postgres/wms';//geoserver server url
// Common.url_root =  "http://172.16.30.6:8002/demo";//springboot server url
// Common.url_root =  "http://10.40.16.106:8002/demo";
// Common.url_geoserver =  'http://10.40.16.106:8090/geoserver/postgres/wms';

//map google satellite online
Common.map_server_google_satellite_online = {};
Common.map_server_google_satellite_online.type = "XYZ";
Common.map_server_google_satellite_online.url = 'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}';
Common.map_server_google_satellite_online.minimumLevel =  1;
Common.map_server_google_satellite_online.maximumLevel =  20;

//map tianditu symbol online
Common.map_server_tianditu_symbol_online = {};
Common.map_server_tianditu_symbol_online.type = "XYZ";
Common.map_server_tianditu_symbol_online.url = 'http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d42fd762c9bb221d415d6d7eb6921f29';
Common.map_server_tianditu_symbol_online.minimumLevel =  1;
Common.map_server_tianditu_symbol_online.maximumLevel =  20;

//map 10.40.16.106 local
Common.map_server_106_satellite_local = {};
Common.map_server_106_satellite_local.type = "XYZ";
Common.map_server_106_satellite_local.url = 'http://10.140.16.106:8080/arcgis/satellite/{z}/{x}/{y}.jpg';
Common.map_server_106_satellite_local.minimumLevel =  1;
Common.map_server_106_satellite_local.maximumLevel =  17;

Common.map_server = [];
Common.map_server.push(Common.map_server_google_satellite_online);
Common.map_server.push(Common.map_server_tianditu_symbol_online);
// Common.map_server.push(Common.map_server_106_satellite_local);
