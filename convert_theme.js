const fs = require('fs');

let content = fs.readFileSync('index.php', 'utf8');

const replacements = [
    [/bg-\[\#050505\]/g, 'bg-zinc-50 dark:bg-[#050505]'],
    [/bg-\[\#0a0a0a\]\/80/g, 'bg-white/80 dark:bg-[#0a0a0a]/80'],
    [/bg-zinc-900(?![\/\-])/g, 'bg-white dark:bg-zinc-900'],
    [/bg-zinc-900\/50/g, 'bg-zinc-100/50 dark:bg-zinc-900/50'],
    [/border-zinc-900/g, 'border-zinc-200 dark:border-zinc-900'],
    [/border-zinc-800(?![\/\-])/g, 'border-zinc-200 dark:border-zinc-800'],
    [/border-zinc-800\/50/g, 'border-zinc-200/50 dark:border-zinc-800/50'],
    [/text-zinc-50(?![\/\-])/g, 'text-zinc-900 dark:text-zinc-50'],
    [/text-zinc-100/g, 'text-zinc-900 dark:text-zinc-100'],
    [/text-zinc-300/g, 'text-zinc-700 dark:text-zinc-300'],
    [/text-zinc-400/g, 'text-zinc-600 dark:text-zinc-400'],
    [/text-zinc-600/g, 'text-zinc-400 dark:text-zinc-600'],
    [/text-white/g, 'text-zinc-900 dark:text-white'],
];

replacements.forEach(([regex, replacement]) => {
    // Only replace if not already preceded by dark:
    content = content.replace(regex, match => {
        // We will just do a simple replace, then clean up any double prefixes.
        return replacement;
    });
});

// Clean up double prefixes like dark:text-zinc-900 dark:text-zinc-50
content = content.replace(/dark:(bg|text|border)-[a-z0-9\-\[\]\#\/]+ dark:(bg|text|border)-[a-z0-9\-\[\]\#\/]+/g, match => {
    return match.split(' ')[1]; 
});
content = content.replace(/bg-zinc-50 bg-zinc-50 dark:bg-\[\#050505\]/g, 'bg-zinc-50 dark:bg-[#050505]');
content = content.replace(/text-zinc-900 text-zinc-900/g, 'text-zinc-900');
content = content.replace(/bg-white bg-white/g, 'bg-white');
content = content.replace(/border-zinc-200 border-zinc-200/g, 'border-zinc-200');

fs.writeFileSync('index.php', content);
console.log('Theme converted successfully!');
