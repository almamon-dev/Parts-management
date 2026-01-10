<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $blogs = [
            [
                'title' => 'The Future of AI in Web Development',
                'content' => 'Artificial Intelligence is revolutionizing the way we build websites. From automated coding to personalized user experiences...',
                'image' => 'uploads/blogs/sample1.jpg',
                'author' => 'Admin',
                'category' => 'Technology',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Top 10 Healthy Habits for Developers',
                'content' => 'Maintaining a healthy lifestyle is crucial for developers who spend long hours in front of the screen. Exercise and diet...',
                'image' => 'uploads/blogs/sample2.jpg',
                'author' => 'Sazzad',
                'category' => 'Lifestyle',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Getting Started with Laravel 11',
                'content' => 'Laravel 11 introduces a more streamlined directory structure and new features that make PHP development even faster...',
                'image' => 'uploads/blogs/sample3.jpg',
                'author' => 'Admin',
                'category' => 'Programming',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($blogs as $blog) {
            Blog::create($blog);
        }
    }
}
