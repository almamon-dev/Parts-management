<?php

$filename = 'public/bulk_products_500.csv';
$file = fopen($filename, 'w');

// Headers
fputcsv($file, [
    'SKU', 'Description', 'List Price', 'Buy Price', 
    'Stock Oakville', 'Stock Mississauga', 'Stock Saskatoon', 
    'Part Type ID', 'Shop View ID', 'Sorting ID', 
    'Location ID', 'Visibility', 'Is Clearance', 
    'Interchange Numbers', 'Fitments', 'Image Source'
]);

$images = [
    'img/Parts/1.png', 'img/Parts/2.png', 'img/Parts/3.png', 'img/Parts/4.png',
    'img/Parts/5.png', 'img/Parts/6.png', 'img/Parts/7.jpg', 'img/Parts/8.png',
    'img/Parts/9.jpg', 'img/Parts/10.jpg', 'img/Parts/11.jpg', 'img/Parts/12.jpg',
    'img/Parts/13.jpg', 'img/Parts/14.jpg', 'img/Parts/15.jpg', 'img/Parts/16.jpg', 'img/Parts/17.jpg'
];

$makes = ['TOYOTA', 'HONDA', 'FORD', 'BMW', 'CHEVROLET'];
$models = [
    'TOYOTA' => ['CAMRY', 'COROLLA', 'RAV4'],
    'HONDA' => ['CIVIC', 'ACCORD', 'CR-V'],
    'FORD' => ['F-150', 'EXPLORER', 'ESCAPE'],
    'BMW' => ['3 SERIES', '5 SERIES', 'X5'],
    'CHEVROLET' => ['SILVERADO 1500', 'MALIBU', 'EQUINOX']
];

for ($i = 1; $i <= 500; $i++) {
    $sku = 'SKU-' . str_pad($i, 5, '0', STR_PAD_LEFT);
    $desc = "Product Description for $sku - High Quality Auto Part";
    $listPrice = rand(50, 500);
    $buyPrice = $listPrice * 0.6;
    
    // Pick 4 images
    $imgSubset = [];
    $startIdx = ($i * 4) % count($images);
    for ($j = 0; $j < 4; $j++) {
        $imgSubset[] = $images[($startIdx + $j) % count($images)];
    }
    
    $make = $makes[array_rand($makes)];
    $model = $models[$make][array_rand($models[$make])];
    $yearStart = rand(2010, 2020);
    $yearEnd = $yearStart + rand(1, 5);
    
    $fitment = "$yearStart-$yearEnd|$make|$model";
    $interchange = "IC-" . rand(1000, 9999) . ",IC-" . rand(1000, 9999);

    fputcsv($file, [
        $sku,
        $desc,
        $listPrice,
        $buyPrice,
        rand(0, 50), 
        rand(0, 50), 
        rand(0, 50), 
        1, 
        1, 
        1, 
        'BIN-' . rand(1, 100),
        'public',
        0,
        $interchange,
        $fitment,
        implode(',', $imgSubset)
    ]);
}

fclose($file);
echo "Generated $filename successfully.\n";
