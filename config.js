var config = {}

config.title = 'Shepherd'

config.items = [
    {name: 'Readme', url: 'README.md'},
    {name: 'Page 1', url: 'url1', items: [
        {name: 'Page 11', url: 'url11'},
        {name: 'Page 12', url: 'url12', items: [
            {name: 'Page 121', url: 'url121'},
            {name: 'Page 122', url: 'url122'},
        ]},
    ]},
    {name: 'Page 2', url: 'url2'},
]
