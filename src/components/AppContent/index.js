import React from "react";
import { useSWRInfinite } from "swr";
import s from "./index.module.scss"

const fetcher = (url) => fetch(url).then((res) => res.json());
const PAGE_SIZE = 15;

export default function App() {
  
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (index) =>
      `https://api.unsplash.com/photos?client_id=${YOUR_UNSPLASH_KEY}&per_page=${PAGE_SIZE}&page=${
        index + 1
      }`,
    fetcher
  );
  const photos = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data && data.length>0 && data[0].length === 0;
  const isReachingEnd =
    isEmpty ||
    (data &&
      data[data.length - 1] &&
      data[data.length - 1].length < PAGE_SIZE);
  const isRefreshing = isValidating && data && data.length === size;

  return (
    <div className={s.container}>
      <div className={s.title}>React-SWR Example</div>
      {isEmpty ? <p>Yay, no issues found.</p> : null}
      <div className={s.photos}>
        {photos.map((item, index) => {
          return (
            <div key={item.id} className={s.imageHolder}>
              <img src={item.urls.thumb} alt={`${index}_image`} />
            </div>
          );
        })}
      </div>
      <div className={s.menu}>
        <button
          disabled={isLoadingMore || isReachingEnd}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? "loading..."
            : isReachingEnd
            ? "no more issues"
            : "load more"}
        </button>
        <button disabled={isRefreshing} onClick={() => mutate()}>
          {isRefreshing ? "refreshing..." : "refresh"}
        </button>
        <button disabled={!size} onClick={() => setSize(0)}>
          clear
        </button>
      </div>
    </div>
  );
}
