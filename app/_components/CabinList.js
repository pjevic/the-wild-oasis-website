/** @format */

import { getCabins } from "@/app/_lib/data-service";
import CabinCard from "@/app/_components/CabinCard";

export default async function CabinList({ filter }) {
  // noStore();

  const cabins = await getCabins();

  if (!cabins.length) return null;

  const filterCabins = {
    all: () => cabins,
    small: () => cabins.filter((cabin) => cabin.maxCapacity <= 3),
    medium: () =>
      cabins.filter(
        (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
      ),
    large: () => cabins.filter((cabin) => cabin.maxCapacity >= 8),
  };

  const displayFilteredCabins = filterCabins[filter]?.() || cabins;

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayFilteredCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
