const fs = require('fs');

const files = [
    '/home/love/Downloads/fog_prediction/fog-prediction/js/compare.js',
    '/home/love/Downloads/fog_prediction/fog-prediction/js/curvspred.js',
    '/home/love/Downloads/fog_prediction/fog-prediction/js/long_pred_comp.js'
];

const forcedChartConfig = `chart: {
    backgroundColor: '#FFFFFF',
    style: {
        fontFamily: "'Inter', 'Roboto', sans-serif"
    }
},`;

const forcedTitle = `title: {
    style: { color: '#0F172A', fontSize: '16px', fontWeight: '500' }
},`;

const forcedXAxis = `xAxis: {
    lineColor: '#CBD5E1',
    tickColor: '#CBD5E1',
    labels: {
        style: { color: '#64748B' }
    },`;

const forcedYAxis = `yAxis: [{
    gridLineColor: '#F1F5F9', // Faint horizontal lines
    gridLineWidth: 1,
    lineColor: '#CBD5E1',
    labels: {
        style: { color: '#64748B' }
    },
    title: {
        style: { 
            color: '#64748B', 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            fontWeight: '600' 
        }
    },`;

const forcedLegend = `legend: {
    backgroundColor: 'transparent',
    itemStyle: { color: '#334155', fontWeight: '500', cursor: 'pointer' },
    itemHoverStyle: { color: '#0F172A' },
    itemHiddenStyle: { color: '#CBD5E1' }
},`;

const forcedRangeSelector = `rangeSelector: {
    buttonTheme: {
        fill: '#F8FAFC',
        stroke: '#CBD5E1',
        'stroke-width': 1,
        r: 4, // border radius
        style: { color: '#334155', fontWeight: '500' },
        states: {
            hover: {
                fill: '#E2E8F0',
                style: { color: '#0F172A' }
            },
            select: {
                fill: '#0F172A',
                style: { color: '#FFFFFF' }
            }
        }
    },
    inputBoxBorderColor: '#CBD5E1',
    inputStyle: { color: '#334155' },
    labelStyle: { color: '#64748B', fontWeight: '500' },`;

const forcedNavigator = `navigator: {
    maskFill: 'rgba(15, 23, 42, 0.05)',
    outlineColor: '#CBD5E1',
    outlineWidth: 1,
    handles: {
        backgroundColor: '#FFFFFF',
        borderColor: '#94A3B8'
    }
},`;

const forcedScrollbar = `scrollbar: {
    barBackgroundColor: '#F1F5F9',
    barBorderColor: '#CBD5E1',
    buttonArrowColor: '#64748B',
    buttonBackgroundColor: '#F8FAFC',
    buttonBorderColor: '#CBD5E1',
    trackBackgroundColor: '#FFFFFF',
    trackBorderColor: '#E2E8F0'
},`;

const forcedPlotBands = `plotBands: [{
    from: 0,
    to: 1,
    color: 'rgba(254, 243, 199, 0.4)', // Soft transparent amber
    label: {
        text: '1 km — Fog Threshold',
        align: 'right',
        x: -10,
        style: {
            color: '#64748B',
            fontSize: '11px',
            fontWeight: '500'
        }
    }
}],`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Chart Background
    content = content.replace(/chart:\s*\{\s*backgroundColor:\s*['"](?:transparent|#FFFFFF|#FAFAFA)['"],\s*style:\s*\{\s*fontFamily:[^\}]+\},\s*height:\s*(\d+)/g, "chart: {\n    backgroundColor: '#FFFFFF',\n    style: { fontFamily: \"'Inter', 'Roboto', sans-serif\" },\n    height: $1");

    // Replace the fallback dark themes (if any)
    content = content.replace(/backgroundColor:\s*['"](?:transparent|#FAFAFA)['"]/g, "backgroundColor: '#FFFFFF'");

    // Range selector explicit override
    content = content.replace(/rangeSelector:\s*\{\s*buttonTheme:\s*\{[\s\S]*?\}\s*\},\s*(buttons:|enabled:)/g, "rangeSelector: {\n    buttonTheme: {\n        fill: '#F8FAFC',\n        stroke: '#CBD5E1',\n        'stroke-width': 1,\n        r: 4,\n        style: { color: '#334155', fontWeight: '500' },\n        states: {\n            hover: { fill: '#E2E8F0', style: { color: '#0F172A' } },\n            select: { fill: '#0F172A', style: { color: '#FFFFFF' } }\n        }\n    },\n    inputBoxBorderColor: '#CBD5E1',\n    inputStyle: { color: '#334155' },\n    labelStyle: { color: '#64748B', fontWeight: '500' },\n    $1");

    // Navigator
    content = content.replace(/navigator:\s*\{\s*maskFill:[^\}]+\}\s*\}/g, "navigator: {\n    maskFill: 'rgba(15, 23, 42, 0.05)',\n    outlineColor: '#CBD5E1',\n    outlineWidth: 1,\n    handles: {\n        backgroundColor: '#FFFFFF',\n        borderColor: '#94A3B8'\n    }\n}");

    // Scrollbar
    content = content.replace(/scrollbar:\s*\{[^\}]+\}/g, "scrollbar: {\n    barBackgroundColor: '#F1F5F9',\n    barBorderColor: '#CBD5E1',\n    buttonArrowColor: '#64748B',\n    buttonBackgroundColor: '#F8FAFC',\n    buttonBorderColor: '#CBD5E1',\n    trackBackgroundColor: '#FFFFFF',\n    trackBorderColor: '#E2E8F0'\n}");

    // Plot bands for fog threshold
    content = content.replace(/plotBands:\s*\[\s*\{\s*from:1,\s*to:0,\s*color:'rgba\(241, 245, 249, 0\.8\)'\s*\}\s*\]/g, "plotBands: [{\n    from: 0,\n    to: 1,\n    color: 'rgba(254, 243, 199, 0.4)',\n    label: {\n        text: '1 km — Fog Threshold',\n        align: 'right',\n        x: -10,\n        style: {\n            color: '#64748B',\n            fontSize: '11px',\n            fontWeight: '500'\n        }\n    }\n}]");

    // Explicit colors
    content = content.replace(/style:\s*\{\s*color:\s*['"]#0F172A['"],\s*fontSize:\s*['"]16px['"],\s*fontWeight:\s*['"]500['"],\s*fontFamily:\s*['"]'Inter', 'Roboto', sans-serif['"]\s*\}/g, "style: { color: '#0F172A', fontSize: '16px', fontWeight: '500' }");

    // Clean up Highcharts.setOptions if there are any that apply themes globally
    // We didn't find any global themes in setOptions earlier, but let's make absolutely sure there's no dark mode CSS being loaded.
    
    fs.writeFileSync(file, content);
});

// Since the user is complaining about a stuborn dark theme, let's search for Highcharts theme includes in the PHP files
const phpFiles = [
    '/home/love/Downloads/fog_prediction/fog-prediction/comparedata.php',
    '/home/love/Downloads/fog_prediction/fog-prediction/short_term_forecast_comp.php',
    '/home/love/Downloads/fog_prediction/fog-prediction/long_pred_comp.php'
];

phpFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Remove dark theme if included
    content = content.replace(/<script[^>]*dark-unica[^>]*><\/script>/gi, '');
    content = content.replace(/<link[^>]*highcharts-dark[^>]*>/gi, '');
    fs.writeFileSync(file, content);
});

console.log("Done");
