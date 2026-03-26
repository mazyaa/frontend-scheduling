"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChangeEvent } from "react";

import useDebounce from "./useDebounce";

import { DELAY, LIMIT_DEFAULT, PAGE_DEFAULT } from "@/constants/list.constats";

const useChangeUrl = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const debounce = useDebounce(); // must be used debounce, if not, it will be called every time user typing in input

  // getting current query from url
  const currentLimit = searchParams.get("limit") ?? LIMIT_DEFAULT;
  const currentPage = searchParams.get("page") ?? PAGE_DEFAULT;
  const currentSearch = searchParams.get("search") ?? "";

  const updateUrl = (updatesParams: Record<string, string>) => {
    // clone current query from url to new URLSearchParams object, so we can change query by key and value parameter
    // why we should clone, because searchParams is read only. So with cloning, we can change query by key and value parameter
    const params = new URLSearchParams(searchParams);

    // use Object.entries to change object to array of key and value, so we can change query by key and value parameter
    Object.entries(updatesParams).forEach(([key, value]) => {
      params.set(key, value); // change query by key and value parameter
    });

    router.replace(`${pathName}?${params.toString()}`); // replace url with new query, but not add to history, so user can back to previous page without new query
  };

  const setUrl = () => {
    const params = new URLSearchParams(searchParams);

    params.set("limit", currentLimit.toString());
    params.set("page", currentPage.toString());

    if (currentSearch) {
      params.set("search", currentSearch);
    } else {
      params.delete("search");
    }

    const newUrl = `${pathName}?${params.toString()}`;

    //validate if newUrl is different with current url
    if (newUrl !== `${pathName}?${searchParams.toString()}`) {
      router.replace(newUrl);
    }
  };

  const handleChangePage = (page: number) => {
    updateUrl({
      page: page.toString(),
    });
  };

  const handleChangeLimit = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLimit = e.target.value;

    updateUrl({
      limit: selectedLimit,
      page: PAGE_DEFAULT.toString(), // reset page
    });
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;

    debounce(() => {
      updateUrl({
        search,
        page: PAGE_DEFAULT.toString(), // reset page
      });
    }, DELAY);
  };

  const handleClearSearch = () => {
    updateUrl({
      search: "",
      page: PAGE_DEFAULT.toString(), // reset page
    });
  };

  return {
    currentLimit,
    currentPage,
    currentSearch,

    setUrl,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
    handleClearSearch,
  };
};

export default useChangeUrl;
