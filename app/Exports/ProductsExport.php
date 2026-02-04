<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductsExport implements FromCollection, WithHeadings, WithMapping
{
    protected int $maxImages = 0;

    public function __construct()
    {
        // constructor এ max image count
        $this->maxImages = Product::with('files')
            ->get()
            ->max(fn ($p) => $p->files->count()) ?? 0;
    }

    public function collection()
    {
        return Product::with([
            'partType',
            'shopView',
            'sorting',
            'partsNumbers',
            'files',
            'fitments',
        ])->get();
    }

    public function headings(): array
    {
        $headers = [
            'SKU',
            'Description',
            'Part Type',
            'Shop View',
            'Sorting',
            'Buy Price',
            'List Price',
            'Stock (Oak)',
            'Stock (Mis)',
            'Stock (Sas)',
            'Location ID',
            'Visibility',
            'Part Numbers',

            'Fitment Year From',
            'Fitment Year To',
            'Fitment Make',
            'Fitment Model',
        ];

        //  Image headers now WORK
        for ($i = 1; $i <= $this->maxImages; $i++) {
            $headers[] = 'Image '.$i;
        }

        return $headers;
    }

    public function map($product): array
    {
        $parts = $product->partsNumbers?->pluck('part_number')->implode(', ') ?? '';

        $base = [
            $product->sku,
            $product->description,
            $product->partType?->name,
            $product->shopView?->name,
            $product->sorting?->name,
            $product->buy_price,
            $product->list_price,
            $product->stock_oakville,
            $product->stock_mississauga,
            $product->stock_saskatoon,
            $product->location_id,
            $product->visibility,
            $parts,
        ];

        $images = [];
        for ($i = 0; $i < $this->maxImages; $i++) {
            $images[] = isset($product->files[$i])
                ? url('/'.$product->files[$i]->file_path)
                : '';
        }

        if ($product->fitments->isEmpty()) {
            return array_merge($base, ['', '', '', ''], $images);
        }

        $rows = [];
        foreach ($product->fitments as $f) {
            $rows[] = array_merge(
                $base,
                [$f->year_from, $f->year_to, $f->make, $f->model],
                $images
            );
        }

        return $rows;
    }
}
