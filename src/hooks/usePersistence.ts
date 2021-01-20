/* eslint-disable no-console */
import netlifyIdentity, { User } from "netlify-identity-widget";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Item, OperatorGoal } from "../types";
import useLocalStorage from "./useLocalStorage";
import NetlifyLoginContext from "../layouts/components/NetlifyLoginContext";

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
  const { currentUser } = useContext(NetlifyLoginContext);
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

  const loginHandler = useCallback(
    async (newUser: User) => {
      console.log("Someone logged in, time to update my localStorage keys");
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
        if (e.response.status === 404) {
          console.log(
            "No data saved for this user yet, setting dirty immediately"
          );
          setIsDirty(true);
        } else {
          console.warn("Failed to fetch user data", e);
        }
      }
    },
    [rawSetItemsToCraft, rawSetMaterialsOwned, rawSetOperatorGoals]
  );

  useEffect(() => {
    // @ts-expect-error check window flag
    if (typeof window !== undefined && window.loginHandlerBound !== true) {
      console.log("useEffect: setting handlers");
      netlifyIdentity.on("login", loginHandler);
      // @ts-expect-error set window flag
      window.loginHandlerBound = true;
    }
    return () => {
      netlifyIdentity.off("login", loginHandler);
    };
  }, [loginHandler]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (currentUser && isDirty) {
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
                  userId: currentUser?.id,
                },
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${currentUser?.token?.access_token}`,
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
  }, [isDirty, itemsToCraft, materialsOwned, operatorGoals, currentUser]);

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
