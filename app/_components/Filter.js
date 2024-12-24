/** @format */

"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filters = [
    { label: "All Cabins", value: "all" },
    { label: "1–3 guests", value: "small" },
    { label: "4–7 guests", value: "medium" },
    { label: "8–12 guests", value: "large" },
  ];

  return (
    <div className="border border-primary-700 flex">
      {filters.map(({ label, value }) => (
        <Button
          key={value}
          filter={value}
          handleFilter={handleFilter}
          activeFilter={activeFilter}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

function Button({ filter, handleFilter, activeFilter, children }) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${
        filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
      }`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}

export default Filter;
