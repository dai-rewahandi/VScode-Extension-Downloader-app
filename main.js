const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

window.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('button');

    const downloadIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path
                fill="currentColor"
                fill-opacity="0"
                stroke-dasharray="20"
                stroke-dashoffset="20"
                d="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5"
            >
                <animate
                    attributeName="d"
                    begin="0.5s"
                    dur="1.5s"
                    repeatCount="indefinite"
                    values="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5;M12 4h2v3h2.5l-4.5 4.5M12 4h-2v3h-2.5l4.5 4.5;M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5"
                />
                <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.5s" values="0;1" />
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0" />
            </path>
            <path stroke-dasharray="14" stroke-dashoffset="14" d="M6 19h12">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0" />
            </path>
        </g>
    </svg>
    `;
    const closeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m11.25 4.75l-6.5 6.5m0-6.5l6.5 6.5"/></svg>
    `;

    const show_data = () => {
        const list = document.getElementById('list');
        list.innerHTML = '';
        const data = JSON.parse(fs.readFileSync(PathFile, 'utf8'));
        data.forEach((item, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            const span = document.createElement('span');
            const span2 = document.createElement('span');
            const package_name = item.url.replace('https://marketplace.visualstudio.com/items?itemName=', '');
            const img = document.createElement('img');
            const packageName = package_name.split('.')[1];
            const publishers = package_name.split('.')[0];
            const download = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publishers}/vsextensions/${packageName}/${item.version}/vspackage`;
            // check error code response
            https.get(download, (res) => {
                if (res.statusCode === 404) {
                    a.href = '#';
                    a.classList.add('cursor-not-allowed','text-red-500');
                } else {
                    a.href = download;
                }
            })

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = closeIcon;
            deleteButton.classList.add('text-red-500', 'hover:text-red-700');
            deleteButton.addEventListener('click', () => {
                const newData = data.filter((_, i) => i !== index);
                fs.writeFileSync(PathFile, JSON.stringify(newData, null, 2));
                show_data();
            });

            img.classList.add('w-6', 'h-6');
            span.textContent = packageName.replace(/-/g, ' ');
            span2.classList.add('flex', 'items-center', 'justify-between', 'gap-2');
            a.innerHTML = downloadIcon;
            li.appendChild(span);
            span2.appendChild(a);
            span2.appendChild(deleteButton);
            // li.appendChild(a);
            li.appendChild(span2);
            li.classList.add(
                'dark:bg-black/60',
                'bg-gray-200',
                'dark:text-white',
                'text-gray-900',
                'p-2',
                'mt-4',
                'rounded',
                'flex',
                'justify-between',
                'items-center'
            );
            list.appendChild(li);
        });
    };


   const dirPath = path.join(os.homedir(), 'Documents', 'Vsdownload');
   if (!fs.existsSync(dirPath)) {
       fs.mkdirSync(dirPath, { recursive: true });
   }
   const PathFile = path.join(dirPath, 'data.json');

    if (fs.existsSync(PathFile)) {
        show_data();
    } else {
    }
    button.addEventListener('click', () => {
        const input_url = document.getElementById('input_url');
        const input_version = document.getElementById('input_version');

        const new_data = {
            url: input_url.value,
            version: input_version.value,
        };

        console.log('click');
        if (input_url.value === '' || input_version.value === '') {
            alert('Please input url and version');
            return;
        } else {
            if (!fs.existsSync(PathFile)) {
                fs.writeFileSync(PathFile, JSON.stringify([new_data], null, 2));
                console.log('create');
            } else {
                const data = JSON.parse(fs.readFileSync(PathFile, 'utf8'));
                data.push(new_data);
                fs.writeFileSync(PathFile, JSON.stringify(data, null, 2));
                console.log('add');
            }
        }
        show_data();
    });
});
