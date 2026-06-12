import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

const useModalRouter = (mediaType) => {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const selectedItemRef = useRef(null);
  const handledKeyRef = useRef(null);

  const titleKey = mediaType === "movie" ? "title" : "name";

  const toSlug = useCallback((item) => {
    const title = item[titleKey];
    const base = title
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      : `id-${item.id}`;
    return mediaType === "movie" ? `/Movie/${base}` : `/TvShow/${base}`;
  }, [titleKey, mediaType]);

  useEffect(() => {
    if (
      location.state?.openModalItem &&
      location.state?.openModalType === mediaType &&
      handledKeyRef.current !== location.key
    ) {
      setSelectedItem(location.state.openModalItem);
      handledKeyRef.current = location.key;
      selectedItemRef.current = location.state.openModalItem;
      window.history.pushState(null, "", toSlug(location.state.openModalItem));
    }
  }, [location.key, location.state, location.state?.openModalItem, location.state?.openModalType, mediaType, toSlug]);

  useEffect(() => {
    const handlePopState = () => {
      if (selectedItemRef.current) {
        selectedItemRef.current = null;
        setSelectedItem(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openModal = useCallback((item) => {
    setSelectedItem(item);
    selectedItemRef.current = item;
    window.history.pushState(null, "", toSlug(item));
  }, [toSlug]);

  const closeModal = useCallback(() => {
    if (selectedItemRef.current === null) return;
    selectedItemRef.current = null;
    setSelectedItem(null);
    window.history.back();
  }, []);

  return { selectedItem, openModal, closeModal };
};

export default useModalRouter;
