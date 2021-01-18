import netlifyIdentity from "netlify-identity-widget";
import { useEffect } from "react";
import { Item, OperatorGoal } from "../types";
import useLocalStorage from "./useLocalStorage";

interface UserData {
  operatorGoals: OperatorGoal[];
  materialsOwned: Record<string, number | null>;
  itemsToCraft: Record<string, Item>;
}

type WithSetters<T> = {
  // eslint-disable-next-line prettier/prettier
  [P in keyof T as `set${Capitalize<string & P>}`]: React.Dispatch<React.SetStateAction<T[P]>>;
};

function usePersistence(): UserData & WithSetters<UserData> {
  const [operatorGoals, setOperatorGoals] = useLocalStorage<OperatorGoal[]>(
    "operatorGoals",
    []
  );
  const [materialsOwned, setMaterialsOwned] = useLocalStorage(
    "materialsOwned",
    {} as Record<string, number | null>
  );
  const [itemsToCraft, setItemsToCraft] = useLocalStorage(
    "itemsToCraft",
    {} as Record<string, Item>
  );

  useEffect(() => {
    netlifyIdentity.on("login", () => { console.log("Someone logged in, time to update my localStorage keys")});
  }, []);

  return {
    operatorGoals,
    setOperatorGoals,
    materialsOwned,
    setMaterialsOwned,
    itemsToCraft,
    setItemsToCraft,
  } as const;
}

export default usePersistence;
