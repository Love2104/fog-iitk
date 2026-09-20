$(document).ready(function() {
    Highcharts.setOptions({
        global: { useUTC: false },
        chart: {
            backgroundColor: 'transparent',
            style: { fontFamily: 'Inter, sans-serif' }
        },
        title: { text: null },
        credits: { enabled: false },
        exporting: { enabled: false },
        legend: { itemStyle: { color: 'var(--ink-2)' } },
        xAxis: {
            type: 'datetime',
            gridLineColor: 'var(--rule)',
            lineColor: 'var(--rule)',
            tickColor: 'var(--rule)',
            labels: { style: { color: 'var(--ink-2)' } }
        },
        yAxis: {
            gridLineColor: 'var(--rule)',
            lineColor: 'var(--rule)',
            labels: { style: { color: 'var(--ink-2)' } },
            title: { style: { color: 'var(--ink)' } }
        },
        plotOptions: {
            series: {
                lineWidth: 2,
                marker: { enabled: false, radius: 2 },
                states: { hover: { lineWidth: 3 } }
            }
        },
        tooltip: {
            backgroundColor: 'var(--paper)',
            borderColor: 'var(--rule)',
            style: { color: 'var(--ink)' },
            xDateFormat: '%Y-%m-%d %H:%M'
        }
    });

    const charts = {};

    function initCharts() {
        // ABOVE GROUND
        charts.vis = Highcharts.chart('chart-vis', {
            colors: ['#10b981', '#f59e0b'],
            yAxis: { title: { text: 'Visibility (km)' }, min: 0 },
            series: [{ name: 'MOR Avg', data: [] }, { name: 'MOR Inst', data: [] }]
        });
        charts.tempLayer = Highcharts.chart('chart-temp-layer', {
            colors: ['#ef4444', '#f97316', '#fcd34d'],
            yAxis: { title: { text: 'Temperature (°C)' } },
            series: [{ name: 'L1 Temp', data: [] }, { name: 'L2 Temp', data: [] }, { name: 'L3 Temp', data: [] }]
        });
        charts.humLayer = Highcharts.chart('chart-hum-layer', {
            colors: ['#3b82f6', '#0ea5e9', '#38bdf8'],
            yAxis: { title: { text: 'Humidity (%)' }, min: 0, max: 100 },
            series: [{ name: 'L1 Hum', data: [] }, { name: 'L2 Hum', data: [] }, { name: 'L3 Hum', data: [] }]
        });
        charts.pm = Highcharts.chart('chart-pm', {
            colors: ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899'],
            yAxis: { title: { text: 'PM (µg/m³)' }, min: 0 },
            series: [{ name: 'PM 1.0', data: [] }, { name: 'PM 2.5', data: [] }, { name: 'PM 4.0', data: [] }, { name: 'PM 10', data: [] }]
        });
        charts.nc = Highcharts.chart('chart-nc', {
            colors: ['#64748b', '#475569', '#334155'],
            yAxis: { title: { text: 'NC (particles)' }, min: 0 },
            series: [{ name: 'NC 0.5', data: [] }, { name: 'NC 1.0', data: [] }, { name: 'NC 2.5', data: [] }]
        });

        // BELOW GROUND
        charts.soilMoisture = Highcharts.chart('chart-soil-moisture', {
            colors: ['#059669'],
            yAxis: { title: { text: 'Soil Moisture' }, min: 0 },
            series: [{ name: 'Soil Moisture', data: [] }]
        });
        charts.soilTemp = Highcharts.chart('chart-soil-temp', {
            colors: ['#dc2626', '#ea580c'],
            yAxis: { title: { text: 'Temperature (°C / °F)' } },
            series: [{ name: 'Temp (°C)', data: [] }, { name: 'Temp (°F)', data: [] }]
        });
        charts.soilBec = Highcharts.chart('chart-soil-bec', {
            colors: ['#d97706', '#b45309'],
            yAxis: { title: { text: 'BEC' } },
            series: [{ name: 'BEC', data: [] }, { name: 'BEC w/ TC', data: [] }]
        });
        charts.soilDp = Highcharts.chart('chart-soil-dielectric', {
            colors: ['#2563eb', '#1d4ed8', '#4338ca', '#3730a3'],
            yAxis: { title: { text: 'Permittivity' } },
            series: [{ name: 'RDP 1', data: [] }, { name: 'RDP 2', data: [] }, { name: 'IDP 1', data: [] }, { name: 'IDP 2', data: [] }]
        });

        // AWS
        charts.awsTemp = Highcharts.chart('chart-aws-temp', {
            colors: ['#ef4444', '#3b82f6'],
            yAxis: { title: { text: 'Temperature (°C)' } },
            series: [{ name: 'Max Temp', data: [] }, { name: 'Min Temp', data: [] }]
        });
        charts.awsHum = Highcharts.chart('chart-aws-hum', {
            colors: ['#3b82f6', '#93c5fd'],
            yAxis: { title: { text: 'Humidity (%)' }, min: 0, max: 100 },
            series: [{ name: 'Max Humidity', data: [] }, { name: 'Min Humidity', data: [] }]
        });
        charts.awsWind = Highcharts.chart('chart-aws-wind', {
            colors: ['#10b981'],
            yAxis: { title: { text: 'Wind Speed (m/s)' }, min: 0 },
            series: [{ name: 'Wind Speed', data: [] }]
        });
        charts.awsRain = Highcharts.chart('chart-aws-rain', {
            chart: { type: 'column' },
            colors: ['#3b82f6'],
            yAxis: { title: { text: 'Rain (mm)' }, min: 0 },
            series: [{ name: 'Rain', data: [] }]
        });
        charts.awsSun = Highcharts.chart('chart-aws-sun', {
            colors: ['#eab308'],
            yAxis: { title: { text: 'Sunshine' }, min: 0 },
            series: [{ name: 'Sunshine', data: [] }]
        });
        charts.awsPres = Highcharts.chart('chart-aws-pres', {
            colors: ['#64748b'],
            yAxis: { title: { text: 'Pressure (hPa)' } },
            series: [{ name: 'Pressure', data: [] }]
        });
    }

    function formatDT(d) {
        return d.toISOString().split('T')[0];
    }

    function loadData(startStr, endStr) {
        // Fetch Visdata (select=0)
        $.get(`apis/sensordata3.php?select=0&start_date=${startStr}&end_date=${endStr}`, function(res) {
            try {
                let data = typeof res === 'string' ? JSON.parse(res) : res;
                let morAvg = [], morInst = [];
                data.forEach(row => {
                    let ts = (row[0] + row[1] * 1800) * 1000 + 5.5 * 3600000;
                    if(row[2] !== null) morAvg.push([ts, row[2]]);
                    if(row[3] !== null) morInst.push([ts, row[3]]);
                });
                
                if (data.length === 0) {
                    showChartEmptyState('chart-vis', startStr, endStr);
                } else {
                    hideChartEmptyState('chart-vis');
                }

                charts.vis.series[0].setData(morAvg, false);
                charts.vis.series[1].setData(morInst, false);
                charts.vis.redraw();
            } catch(e) { console.error('Vis error', e); }
        });

        // Fetch Metdata (select=1)
        $.get(`apis/sensordata3.php?select=1&start_date=${startStr}&end_date=${endStr}`, function(res) {
            try {
                let data = typeof res === 'string' ? JSON.parse(res) : res;
                let l1h=[], l1t=[], l2h=[], l2t=[], l3h=[], l3t=[], pm1=[], pm25=[], pm4=[], pm10=[], nc05=[], nc1=[], nc25=[];
                data.forEach(row => {
                    let ts = (row[0] + row[1] * 1800) * 1000 + 5.5 * 3600000;
                    if(row[2] !== null) l1h.push([ts, row[2]]);
                    if(row[3] !== null) l1t.push([ts, row[3]]);
                    if(row[4] !== null) l2h.push([ts, row[4]]);
                    if(row[5] !== null) l2t.push([ts, row[5]]);
                    if(row[6] !== null) l3h.push([ts, row[6]]);
                    if(row[7] !== null) l3t.push([ts, row[7]]);
                    if(row[8] !== null) pm1.push([ts, row[8]]);
                    if(row[9] !== null) pm25.push([ts, row[9]]);
                    if(row[10] !== null) pm4.push([ts, row[10]]);
                    if(row[11] !== null) pm10.push([ts, row[11]]);
                    if(row[12] !== null) nc05.push([ts, row[12]]);
                    if(row[13] !== null) nc1.push([ts, row[13]]);
                    if(row[14] !== null) nc25.push([ts, row[14]]);
                });
                
                if (data.length === 0) {
                    showChartEmptyState('chart-hum-layer', startStr, endStr);
                    showChartEmptyState('chart-temp-layer', startStr, endStr);
                    showChartEmptyState('chart-pm', startStr, endStr);
                    showChartEmptyState('chart-nc', startStr, endStr);
                } else {
                    hideChartEmptyState('chart-hum-layer');
                    hideChartEmptyState('chart-temp-layer');
                    hideChartEmptyState('chart-pm');
                    hideChartEmptyState('chart-nc');
                }

                charts.humLayer.series[0].setData(l1h, false);
                charts.humLayer.series[1].setData(l2h, false);
                charts.humLayer.series[2].setData(l3h, false);
                charts.humLayer.redraw();
                
                charts.tempLayer.series[0].setData(l1t, false);
                charts.tempLayer.series[1].setData(l2t, false);
                charts.tempLayer.series[2].setData(l3t, false);
                charts.tempLayer.redraw();

                charts.pm.series[0].setData(pm1, false);
                charts.pm.series[1].setData(pm25, false);
                charts.pm.series[2].setData(pm4, false);
                charts.pm.series[3].setData(pm10, false);
                charts.pm.redraw();

                charts.nc.series[0].setData(nc05, false);
                charts.nc.series[1].setData(nc1, false);
                charts.nc.series[2].setData(nc25, false);
                charts.nc.redraw();
            } catch(e) { console.error('Met error', e); }
        });

        // Fetch Hydraprobe (select=2)
        $.get(`apis/sensordata3.php?select=2&start_date=${startStr}&end_date=${endStr}`, function(res) {
            try {
                let data = typeof res === 'string' ? JSON.parse(res) : res;
                let sm=[], bwtc=[], tc=[], tf=[], bec=[], rdp1=[], rdp2=[], idp1=[], idp2=[];
                data.forEach(row => {
                    let ts = (row[0] + row[1] * 1800) * 1000 + 5.5 * 3600000;
                    if(row[2] !== null) sm.push([ts, row[2]]);
                    if(row[3] !== null) bwtc.push([ts, row[3]]);
                    if(row[4] !== null) tc.push([ts, row[4]]);
                    if(row[5] !== null) tf.push([ts, row[5]]);
                    if(row[6] !== null) bec.push([ts, row[6]]);
                    if(row[7] !== null) rdp1.push([ts, row[7]]);
                    if(row[8] !== null) rdp2.push([ts, row[8]]);
                    if(row[9] !== null) idp1.push([ts, row[9]]);
                    if(row[10] !== null) idp2.push([ts, row[10]]);
                });
                
                if (data.length === 0) {
                    showChartEmptyState('chart-soil-moisture', startStr, endStr);
                    showChartEmptyState('chart-soil-temp', startStr, endStr);
                    showChartEmptyState('chart-soil-bec', startStr, endStr);
                    showChartEmptyState('chart-soil-dielectric', startStr, endStr);
                } else {
                    hideChartEmptyState('chart-soil-moisture');
                    hideChartEmptyState('chart-soil-temp');
                    hideChartEmptyState('chart-soil-bec');
                    hideChartEmptyState('chart-soil-dielectric');
                }

                charts.soilMoisture.series[0].setData(sm, true);
                
                charts.soilTemp.series[0].setData(tc, false);
                charts.soilTemp.series[1].setData(tf, false);
                charts.soilTemp.redraw();

                charts.soilBec.series[0].setData(bec, false);
                charts.soilBec.series[1].setData(bwtc, false);
                charts.soilBec.redraw();

                charts.soilDp.series[0].setData(rdp1, false);
                charts.soilDp.series[1].setData(rdp2, false);
                charts.soilDp.series[2].setData(idp1, false);
                charts.soilDp.series[3].setData(idp2, false);
                charts.soilDp.redraw();
            } catch(e) { console.error('Hydra error', e); }
        });

        // Fetch AWS
        $.get(`apis/sensordata.php?select=1&start_date=${startStr}&end_date=${endStr}`, function(res) {
            try {
                let data = typeof res === 'string' ? JSON.parse(res) : res;
                let maxt=[], mint=[], maxh=[], minh=[], wind=[], rain=[], sun=[], pres=[];
                data.forEach(row => {
                    let ts = new Date(row.date_time).getTime() + (parseInt(row.slot) * 1800000); // slot is 0 or 1
                    if(row.max_temp !== null) maxt.push([ts, parseFloat(row.max_temp)]);
                    if(row.min_temp !== null) mint.push([ts, parseFloat(row.min_temp)]);
                    if(row.max_humidity !== null) maxh.push([ts, parseFloat(row.max_humidity)]);
                    if(row.min_humidity !== null) minh.push([ts, parseFloat(row.min_humidity)]);
                    if(row.wind_speed !== null) wind.push([ts, parseFloat(row.wind_speed)]);
                    if(row.rain !== null) rain.push([ts, parseFloat(row.rain)]);
                    if(row.sunshine !== null) sun.push([ts, parseFloat(row.sunshine)]);
                    if(row.atmospheric_pressure !== null) pres.push([ts, parseFloat(row.atmospheric_pressure)]);
                });
                
                if (data.length === 0) {
                    showChartEmptyState('chart-aws-temp', startStr, endStr);
                    showChartEmptyState('chart-aws-hum', startStr, endStr);
                    showChartEmptyState('chart-aws-wind', startStr, endStr);
                    showChartEmptyState('chart-aws-rain', startStr, endStr);
                    showChartEmptyState('chart-aws-sun', startStr, endStr);
                    showChartEmptyState('chart-aws-pres', startStr, endStr);
                } else {
                    hideChartEmptyState('chart-aws-temp');
                    hideChartEmptyState('chart-aws-hum');
                    hideChartEmptyState('chart-aws-wind');
                    hideChartEmptyState('chart-aws-rain');
                    hideChartEmptyState('chart-aws-sun');
                    hideChartEmptyState('chart-aws-pres');
                }

                charts.awsTemp.series[0].setData(maxt, false);
                charts.awsTemp.series[1].setData(mint, false);
                charts.awsTemp.redraw();

                charts.awsHum.series[0].setData(maxh, false);
                charts.awsHum.series[1].setData(minh, false);
                charts.awsHum.redraw();

                charts.awsWind.series[0].setData(wind, true);
                charts.awsRain.series[0].setData(rain, true);
                charts.awsSun.series[0].setData(sun, true);
                charts.awsPres.series[0].setData(pres, true);
            } catch(e) { console.error('AWS error', e); }
        });
    }

    window.latestGlobalTimestamp = null;

    window.snapToLatest = function() {
        if (!window.latestGlobalTimestamp) return;
        let eDate = new Date(window.latestGlobalTimestamp);
        let sDate = new Date(window.latestGlobalTimestamp);
        sDate.setDate(eDate.getDate() - 7);
        $('#win-start').val(formatDT(sDate));
        $('#win-end').val(formatDT(eDate));
        $('.ed-quick-range-opt').removeClass('active');
        $('[data-range="7"]').addClass('active');
        loadData(formatDT(sDate), formatDT(eDate));
    };

    function showChartEmptyState(chartId, startStr, endStr) {
        $(`#empty-${chartId}`).addClass('active');
        $(`#empty-${chartId} .empty-sel-start`).text(startStr);
        $(`#empty-${chartId} .empty-sel-end`).text(endStr);
        $(`#empty-${chartId} .empty-latest-date`).text(window.latestGlobalTimestamp || '--');
    }

    function hideChartEmptyState(chartId) {
        $(`#empty-${chartId}`).removeClass('active');
    }

    function initPage() {
        initCharts();

        $('.ed-val').addClass('loading-state');
        $('#val-data-status').text('SYNCING').css('color', 'var(--ink-2)');
        $('#sync-status').text('SYNCING...');

        // Fetch latest data FIRST to determine real default date range
        $.get('apis/sensordata_latest.php', function(data) {
            let eDate = new Date(); // fallback
            if(data && data.timestamp) {
                // Remove the extra milliseconds or parsing issues, just parse directly
                // data.timestamp format is "2026-08-27 10:42:52"
                eDate = new Date(data.timestamp.replace(/-/g, '/'));
                window.latestGlobalTimestamp = data.timestamp;
                
                $('.ed-val').removeClass('loading-state');
                $('#val-last-obs').text(data.timestamp || '--');
                $('#val-vis').html((data.visibility !== null ? data.visibility : '--') + ' <span class="ed-unit">km</span>');
                $('#val-temp').html((data.temperature !== null ? parseFloat(data.temperature).toFixed(1) : '--') + ' <span class="ed-unit">°C</span>');
                $('#val-hum').html((data.humidity !== null ? parseFloat(data.humidity).toFixed(1) : '--') + ' <span class="ed-unit">%</span>');
                $('#val-wind').html((data.wind_speed !== null ? parseFloat(data.wind_speed).toFixed(2) : '--') + ' <span class="ed-unit">m/s</span>');
                $('#val-pres').html((data.pressure !== null ? parseFloat(data.pressure).toFixed(1) : '--') + ' <span class="ed-unit">hPa</span>');
                $('#val-pm25').html((data.pm25 !== null ? parseFloat(data.pm25).toFixed(1) : '--') + ' <span class="ed-unit">µg/m³</span>');
                
                $('#val-data-status').text('ONLINE').css('color', '#10b981');
                $('#sync-status').text('SYNCED');
            }
            
            let sDate = new Date(eDate.getTime());
            sDate.setDate(eDate.getDate() - 7);
            
            $('#win-start').val(formatDT(sDate));
            $('#win-end').val(formatDT(eDate));

            loadData(formatDT(sDate), formatDT(eDate));
        });



        $('#btn-apply-dates').click(function() {
            $('.ed-quick-range-opt').removeClass('active');
            let s = $('#win-start').val();
            let e = $('#win-end').val();
            if(s && e) loadData(s, e);
        });

        $('.ed-quick-range-opt').click(function() {
            $('.ed-quick-range-opt').removeClass('active');
            $(this).addClass('active');
            let days = parseInt($(this).data('range'));
            
            // Base the quick range on the latest actual observation if possible
            let eDate = window.latestGlobalTimestamp ? new Date(window.latestGlobalTimestamp.replace(/-/g, '/')) : new Date();
            let sDate = new Date(eDate.getTime());
            sDate.setDate(eDate.getDate() - days);
            
            $('#win-start').val(formatDT(sDate));
            $('#win-end').val(formatDT(eDate));
            loadData(formatDT(sDate), formatDT(eDate));
        });
    }

    initPage();
});
