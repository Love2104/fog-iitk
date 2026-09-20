const fs = require('fs');

const files = [
    '/home/love/Downloads/fog_prediction/fog-prediction/js/compare.js',
    '/home/love/Downloads/fog_prediction/fog-prediction/js/curvspred.js',
    '/home/love/Downloads/fog_prediction/fog-prediction/js/long_pred_comp.js'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Chart background and font
    // Replace: chart: { ... height: XYZ,
    content = content.replace(/chart:\s*\{\s*(backgroundColor:\s*'[^']+',\s*)?height:\s*(\d+),/g, "chart: {\n                backgroundColor: 'transparent',\n                style: { fontFamily: \"'Inter', 'Roboto', sans-serif\" },\n                height: $2,");

    // 2. Range Selector Button Theme
    // Replace: rangeSelector: { \n buttons: [{
    content = content.replace(/rangeSelector:\s*\{\s*buttons:/g, "rangeSelector: {\n                buttonTheme: {\n                    fill: '#F1F5F9',\n                    style: { color: '#334155', fontWeight: '500' },\n                    states: {\n                        hover: { fill: '#E2E8F0' },\n                        select: { fill: '#0F172A', style: { color: '#FFFFFF' } }\n                    }\n                },\n                buttons:");

    // 3. Exporting Icon (hamburger)
    // Replace: contextButton: { \n menuItems:
    content = content.replace(/contextButton:\s*\{\s*menuItems:/g, "contextButton: {\n                        symbolStroke: '#334155',\n                        theme: { fill: 'transparent' },\n                        menuItems:");

    // 4. Force specific dark mode text fixes ONLY for compare.js (since I missed it earlier)
    if (file.includes('compare.js')) {
        content = content.replace(/color:\s*"red"/g, "color: \"#64748B\"");
        content = content.replace(/color:\s*'red'/g, "color: '#64748B'");
        content = content.replace(/gridLineWidth:0/g, "gridLineColor: '#F1F5F9', gridLineWidth: 1, lineColor: '#CBD5E1', lineWidth: 1");
        // Title fixes
        content = content.replace(/style:\s*\{\s*fontSize:\s*"18px",\s*color:\s*"#64748B"\s*\}/g, "style: { fontSize: \"16px\", color: \"#0F172A\", fontWeight: \"500\", fontFamily: \"'Inter', 'Roboto', sans-serif\" }");
        // plotlines red -> dashed slate
        content = content.replace(/plotLines:\s*\[\{\s*value:\s*1,\s*width:\s*1,\s*color:\s*'#64748B'/g, "plotLines: [{ value: 1, width: 1, color: '#94A3B8', dashStyle: 'Dash'");
        content = content.replace(/color:'rgb\(255, 248, 238\)'/g, "color:'rgba(241, 245, 249, 0.8)'");
        content = content.replace(/itemStyle:\{\s*fontSize:"14px"\s*\}/g, "itemStyle: { color: '#334155', fontSize: '13px', fontWeight: 'normal' }");
        
        // Add label styles to xAxis and yAxis if missing
        content = content.replace(/yAxis:\s*\[\{\s*labels:\s*\{\s*align:\s*'right',\s*x:\s*-5\s*\}/g, "yAxis: [{ labels: { align: 'right', x: -5, style: { color: '#64748B', fontSize: '11px' } }");
        // xAxis in compare.js didn't have labels explicitly
        content = content.replace(/xAxis:\s*\{/g, "xAxis: { lineColor: '#CBD5E1', lineWidth: 1, gridLineWidth: 0, labels: { style: { color: '#64748B', fontSize: '11px' } },");
        
        // fix the plotlines at xAxis (red line)
        content = content.replace(/color:\s*'#FF0000'/g, "color: '#FF0000'");
        
        // title: 'Visibility (km)'
        content = content.replace(/text:\s*'Visibility\s*\(km\)',\s*align:\s*'left',/g, "text: 'Visibility (km)',");
        content = content.replace(/text:\s*'Temperature\s*\(°C\)',\s*align:\s*'left',/g, "text: 'Temperature (°C)',");
        content = content.replace(/text:\s*'Humidity\s*\(%\)',\s*align:\s*'left',/g, "text: 'Humidity (%)',");
        content = content.replace(/text:\s*'Wind\s*\(km\/h\)',\s*align:\s*'left',/g, "text: 'Wind (km/h)',");
    }

    fs.writeFileSync(file, content);
});
console.log("Done updating charts.");
