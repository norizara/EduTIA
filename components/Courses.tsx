"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { CourseUI } from "@/types/course-ui";
import { CategoryUI } from "@/types/category-ui";
import { useRouter, useSearchParams } from "next/navigation";

type CoursesProps = {
  courses: CourseUI[];
  categories: CategoryUI[];
};

export default function Courses({ courses, categories }: CoursesProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  function handleCategoryToggle(slug: string): void {
    const params = new URLSearchParams(searchParams.toString());
    const selectedCategorySlugs = params.getAll("category");

    if (selectedCategorySlugs.includes(slug)) {
      params.delete("category");
      selectedCategorySlugs
        .filter((c) => c !== slug)
        .forEach((c) => params.append("category", c));
    } else {
      params.append("category", slug);
    }

    router.push(`/courses?${params.toString()}`);
  }

  function handleLevelToggle(level: string): void {
    const params = new URLSearchParams(searchParams.toString());
    const selectedLevels = params.getAll("level");

    if (selectedLevels.includes(level)) {
      params.delete("level");
      selectedLevels
        .filter((c) => c !== level)
        .forEach((c) => params.append("level", c));
    } else {
      params.append("level", level);
    }

    router.push(`/courses?${params.toString()}`);
  }

  function handleSort(value: string): void {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.push(`/courses?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* semi header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3  md:flex-row">
            <h1 className="text-lg font-bold text-slate-900">All Courses</h1>
            <div className="flex-1">
              <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="lg:hidden p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* sidebar */}
          <aside
            className={`z-40
            fixed inset-0 bg-white lg:bg-transparent 
            lg:sticky lg:top-6 lg:w-64 lg:block lg:h-[calc(100vh-3rem)] lg:overflow-y-auto 
            overflow-y-auto transition-transform duration-300 ease-in-out
            ${
              mobileFiltersOpen
                ? "translate-x-0 sm:w-100"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          >
            <div className="p-6 lg:p-0 h-full">
              <div className="flex items-center justify-between lg:hidden mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              {/* filter by category */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={params
                            .getAll("category")
                            .includes(category.slug)}
                          onChange={() => handleCategoryToggle(category.slug)}
                          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-eduBlue checked:border-eduBlue transition-all"
                        />
                        <svg
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-slate-600 group-hover:text-eduBlue transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* levels difficulty filter */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Level
                </h3>
                <div className="space-y-3">
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={params.getAll("level").includes(level)}
                          onChange={() => handleLevelToggle(level)}
                          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-eduBlue checked:border-eduBlue transition-all"
                        />
                        <svg
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-slate-600 group-hover:text-eduBlue capitalize transition-colors">
                        {level.toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Link
                href="/courses"
                className="mt-6 block w-full text-center py-3 text-sm font-bold text-slate-600 border border-slate-300 rounded-lghover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Clear Filters
              </Link>
            </div>
          </aside>

          {/* main contents */}
          <main className="flex-1">
            {/* sort toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 font-medium">
                Showing{" "}
                <span className="text-slate-900 font-bold">
                  {courses.length}
                </span>{" "}
                courses
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 hidden sm:inline">
                  Sort by:
                </span>
                <div className="relative group">
                  <select
                    value={params.get("sort") ?? "default"}
                    onChange={(e) => handleSort(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2 rounded-lg text-sm font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-eduBlue/20 focus:border-eduBlue"
                  >
                    <option value="default">Default</option>
                    <option value="rating">Highest Rated</option>
                    <option value="review">Most Reviewed</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* courses grid */}
            {courses.length > 0 ? (
              <div className="grid gap-6 mx-10 sm:grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No courses found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <Link
                  href="/courses"
                  className="mt-6 inline-block px-1 py-2 text-sm font-bold text-eduBlue hover:underline hover:text-eduBlue/80 transition-colors"
                >
                  Clear all filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
