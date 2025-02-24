import { EventListTable } from "~/app/_components/event-list";
import LibMain, {
  LibCardContainer,
  LibH1,
} from "~/app/_components/lib-elements";

export const metadata = {
  title: "Libtour - Events",
  description: "A Summer-long series of events at Redlibbets",
};

export default async function Events() {
  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Events Admin</LibH1>
      </div>

      <LibCardContainer splitAtLargeSizes={false}>
        <EventListTable edit={true} />
      </LibCardContainer>
    </LibMain>
  );
}
