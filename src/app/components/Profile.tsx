
import JournalOverview from "./profile/JournalOverview";
import PersonalProjectOverview from "./profile/PersonalProjectOverview";
import TodoOverview from "./profile/TodoOverview";
import useDocumentTitle from "../../UseDocumentTitle";
import { useEffect, useState } from "react";
import { useGetLastTodosQuery } from "../redux/features/todo/todo.api";
import { Button } from "@mui/material";
import { formatDataArray } from "../lib/dateFunctions";



const Profile = () => {
  useDocumentTitle({ title: 'Dashboard' })
  const [showRandom, setShowRandom] = useState(true);

  const { data, isLoading, isSuccess } = useGetLastTodosQuery(undefined);

  const [dates, setDates] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [randomValue] = useState<number[]>(() =>
    Array.from({ length: 30 }, () => Math.floor(Math.random() * 21))
  );
  useEffect(() => {
    if (data?.data?.lastdays) {
      const { dates, values } = formatDataArray(data?.data?.lastdays);

      setDates(dates);
      if (showRandom) {
        setValues(randomValue);
      } else {
        setValues(values);
      }
    }
  }, [data, showRandom]);
  return (
    <div>
      {
        isSuccess &&

        <Button
          variant="contained"
          size="small"
          onClick={() => setShowRandom(!showRandom)}
        >
          {showRandom ? "Show real data" : "Show fake data"}
        </Button>
      }
      <TodoOverview isLoading={isLoading} dates={dates} values={values} />
      <PersonalProjectOverview showRandom={showRandom} />
      <JournalOverview />
    </div>
  );
};

export default Profile;
