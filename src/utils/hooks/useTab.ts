import { useEffect, useState } from "react";
import { ListItem } from "../types/index.types";

export function useTab(tabs: ListItem[], options?: { defaultEmpty: boolean }) {
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (!options?.defaultEmpty) {
      setActiveTab(tabs[0]?.id);
    }
  }, []);

  function handleTabChange(payload: ListItem) {
    setActiveTab(payload.id);
  }

  return {
    tabs,
    activeTab,
    activeTabItem: tabs.find((t) => activeTab === t.id),
    handleTabChange,
  };
}
