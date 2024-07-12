import { EventListTable } from "~/app/_components/event-list";
import LibMain, { LibH1 } from "~/app/_components/lib-elements";

export const metadata = {
  title: "Libtour - Events",
  description: "A Summer-long series of events at Redlibbets",
};

export default async function Events() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Events</LibH1>
      </div>

      <div className="mx-1  mt-4 grid grid-cols-1 gap-1 sm:mx-2  sm:gap-2  xl:mx-0  xl:gap-4">
        <EventListTable />
      </div>
    </LibMain>
  );
}
