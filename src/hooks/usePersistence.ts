/* eslint-disable no-console */
import netlifyIdentity, { User } from "netlify-identity-widget";
import { useEffect, useState } from "react";
import axios from "axios";
import { Item, OperatorGoal } from "../types";
import useLocalStorage from "./useLocalStorage";

// amount of time in ms to wait after a single state change until updating remote
const TIME_UNTIL_REMOTE_UPDATE = 5000;

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
  const [user, setUser] = useState<User | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [operatorGoals, rawSetOperatorGoals] = useLocalStorage<OperatorGoal[]>(
    "operatorGoals",
    []
  );
  const [materialsOwned, rawSetMaterialsOwned] = useLocalStorage(
    "materialsOwned",
    {} as Record<string, number | null>
  );
  const [itemsToCraft, rawSetItemsToCraft] = useLocalStorage(
    "itemsToCraft",
    {} as Record<string, Item>
  );

  function controlledSetter<T>(
    rawSetter: React.Dispatch<React.SetStateAction<T>>
  ) {
    return ((value: T) => {
      console.log("State changed, marking as dirty");
      setIsDirty(true);
      rawSetter(value);
    }) as React.Dispatch<React.SetStateAction<T>>;
  }

  useEffect(() => {
    const handler = async (newUser: User) => {
      console.log("Someone logged in, time to update my localStorage keys");
      setUser(newUser);
      try {
        const response = await axios.get<UserData>(
          "/.netlify/functions/user-data",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${newUser.token?.access_token}`,
            },
            params: {
              userId: newUser.id,
            },
          }
        );
        rawSetItemsToCraft(response.data.itemsToCraft);
        rawSetMaterialsOwned(response.data.materialsOwned);
        rawSetOperatorGoals(response.data.operatorGoals);
      } catch (e) {
        console.warn("Failed to fetch user data", e);
      }
    };
    netlifyIdentity.on("login", handler);
    return () => netlifyIdentity.off("login", handler);
  }, [rawSetItemsToCraft, rawSetMaterialsOwned, rawSetOperatorGoals]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (isDirty) {
        try {
          console.log("Local state dirty, updating remote");
          axios
            .post(
              "/.netlify/functions/user-data",
              {
                itemsToCraft,
                materialsOwned,
                operatorGoals,
              },
              {
                params: {
                  userId: user?.id,
                },
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user?.token?.access_token}`,
                },
              }
            )
            .then(() => setIsDirty(false));
        } catch (e) {
          console.warn("Failed to update state", e);
        }
      }
    }, TIME_UNTIL_REMOTE_UPDATE);
    return () => clearTimeout(timerId);
  }, [isDirty, itemsToCraft, materialsOwned, operatorGoals, user]);

  return {
    operatorGoals,
    setOperatorGoals: controlledSetter(rawSetOperatorGoals),
    materialsOwned,
    setMaterialsOwned: controlledSetter(rawSetMaterialsOwned),
    itemsToCraft,
    setItemsToCraft: controlledSetter(rawSetItemsToCraft),
  } as const;
}

export default usePersistence;
