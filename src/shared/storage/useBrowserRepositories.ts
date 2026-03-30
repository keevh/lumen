"use client";

import { useEffect, useState } from "react";
import type { CommerceRepositories } from "@/shared/storage/storage-port";
import { getBrowserRepositories } from "@/shared/storage/repositories";

export function useBrowserRepositories() {
  const [repositories, setRepositories] = useState<CommerceRepositories | null>(null);

  useEffect(() => {
    setRepositories(getBrowserRepositories());
  }, []);

  return repositories;
}
