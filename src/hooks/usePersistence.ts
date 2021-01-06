import { useEffect, useState } from "react";
import axios from "axios";
import { PlannerState } from "../functions/planner-state";
import { Item, OperatorGoal } from "../types";

function usePersistence() {
  const [materialsOwned, setMaterialsOwned] = useState<Record<string, number>>(
    {}
  );
  const [itemsToCraft, setItemsToCraft] = useState<Record<string, Item>>({});
  const [goalNames, setGoalNames] = useState<string[]>([]);
  const [operatorGoals, setOperatorGoals] = useState<OperatorGoal[]>([]);
  const [timerStartTimestamp, setTimerStartTimestamp] = useState<number>();
  const [timeoutId, setTimeoutId] = useState<number>();

  useEffect(() => {
    if (window.location.hash) {
      axios
        .get<PlannerState>(
          `${window.location.origin}/.netlify/functions/planner-state`,
          {
            params: {
              slug: window.location.hash.replace("#", ""),
            },
          }
        )
        .then((response) => {
          setMaterialsOwned(response.data.materialsOwned);
          setItemsToCraft(response.data.itemsToCraft);
          setGoalNames(response.data.goalNames);
          setOperatorGoals(response.data.operatorGoals);
        });
    } else {
      // TODO use localStorage as a fallback
      console.warn("No slug specified!");
    }
  }, []);

  function controlledSetter<F extends (...args: any[]) => any>(
    setter: F
  ): (...funcArgs: Parameters<F>) => ReturnType<F> {
    console.log("Setter called!", setter.name);
    return setter;
  }

  return {
    materialsOwned,
    itemsToCraft,
    goalNames,
    operatorGoals,
    setMaterialsOwned: controlledSetter(setMaterialsOwned),
    setItemsToCraft: controlledSetter(setItemsToCraft),
    setGoalNames: controlledSetter(setGoalNames),
    setOperatorGoals: controlledSetter(setOperatorGoals),
  } as const;
}

export default usePersistence;
