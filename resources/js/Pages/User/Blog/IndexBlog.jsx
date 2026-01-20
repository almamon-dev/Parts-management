import React, { useState, useEffect } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { Skeleton } from "@/Components/ui/Skeleton";
import {
    Search,
    ImageOff,
    Calendar,
    ChevronRight,
    BookOpen,
    Clock,
} from "lucide-react";

// --- Skeleton for Regular Blog Cards ---
const BlogCardSkeleton = () => (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden flex flex-col p-4">
        <Skeleton className="h-52 w-full rounded-sm mb-5" />
        <div className="flex-grow space-y-3 mb-4 px-2">
            <Skeleton className="h-3 w-1/3 rounded-md" />
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
        <div className="pt-4 border-t border-gray-50 px-2">
            <Skeleton className="h-4 w-20 rounded-md" />
        </div>
    </div>
);

// --- Skeleton for Featured Article ---
const FeaturedSkeleton = () => (
    <div className="bg-white rounded-md border border-gray-100 overflow-hidden mb-12 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 h-64 lg:h-80">
            <Skeleton className="w-full h-full" />
        </div>
        <div className="lg:w-1/2 p-8 lg:p-12 space-y-4">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <div className="flex gap-4 pt-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-28 mt-4" />
        </div>
    </div>
);

export default function BlogIndex() {
    const { auth, blogs } = usePage().props;
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // API থেকে ডেটা আসার সিমুলেশন বা রিয়েল ডেটা চেক
        if (blogs) {
            const timer = setTimeout(() => setIsLoading(false), 800);
            return () => clearTimeout(timer);
        }
    }, [blogs]);

    const blogList = Array.isArray(blogs) ? blogs : blogs?.data || [];
    const featuredBlog = blogList[0];
    const regularBlogs = blogList.slice(1);

    const filteredBlogs = regularBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <UserLayout user={auth.user}>
            <Head title="Industry Insights & Blog" />
            <div className="p-6 bg-[#F8F9FB] min-h-screen">
                <div className="max-w-8xl mx-auto">
                    {/* Featured Section Logic */}
                    {isLoading ? (
                        <FeaturedSkeleton />
                    ) : (
                        featuredBlog &&
                        !searchQuery && (
                            <div className="bg-white rounded-md border border-gray-100 overflow-hidden mb-12 flex flex-col lg:flex-row hover:shadow-md transition-shadow group">
                                <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden bg-gray-100">
                                    <img
                                        src={`/${featuredBlog.image}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt="Featured"
                                    />
                                </div>
                                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                                    <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-4 block">
                                        Featured Article
                                    </span>
                                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-4 leading-tight">
                                        {featuredBlog.title}
                                    </h2>
                                    <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                                        {featuredBlog.content}
                                    </p>
                                    <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase mb-6">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={14} />{" "}
                                            {new Date(
                                                featuredBlog.created_at,
                                            ).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={14} /> 5 min read
                                        </span>
                                    </div>
                                    <Link
                                        href={route(
                                            "blogs.show",
                                            featuredBlog.id,
                                        )}
                                        className="text-red-700 font-black text-sm flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-tighter"
                                    >
                                        Read More{" "}
                                        <ChevronRight
                                            size={16}
                                            strokeWidth={3}
                                        />
                                    </Link>
                                </div>
                            </div>
                        )
                    )}

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading ? (
                            Array(6)
                                .fill(0)
                                .map((_, i) => <BlogCardSkeleton key={i} />)
                        ) : filteredBlogs.length === 0 ? (
                            <div className="col-span-full py-20 text-center">
                                <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900">
                                    No articles match your search
                                </h3>
                            </div>
                        ) : (
                            filteredBlogs.map((blog) => (
                                <div
                                    key={blog.id}
                                    className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden flex flex-col p-4 hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="relative rounded-sm overflow-hidden h-52 bg-gray-100 mb-5">
                                        <img
                                            src={`/${blog.image}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            alt={blog.title}
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 text-[9px] font-black uppercase px-3 py-1.5 rounded-full shadow-sm">
                                            {blog.category}
                                        </div>
                                    </div>

                                    <div className="flex-grow px-2">
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />{" "}
                                                {new Date(
                                                    blog.created_at,
                                                ).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} /> 5 min read
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 leading-tight mb-3 line-clamp-2 group-hover:text-red-700 transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-4 leading-relaxed">
                                            {blog.content}
                                        </p>
                                    </div>

                                    <div className="pt-4 px-2 border-t border-gray-50 flex items-center justify-start">
                                        <Link
                                            href={route("blogs.show", blog.id)}
                                            className="text-red-700 font-black text-xs uppercase tracking-tighter flex items-center gap-1 hover:gap-3 transition-all"
                                        >
                                            Read More{" "}
                                            <ChevronRight
                                                size={14}
                                                strokeWidth={3}
                                            />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
