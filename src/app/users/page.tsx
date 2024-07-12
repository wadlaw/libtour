import { api } from "~/trpc/server";
import LibMain, {
  LibCard,
  LibCardContainer,
  LibH1,
} from "~/app/_components/lib-elements";
import UserSelect from "../_components/user-select";

export const metadata = {
  title: "Libtour - User Setup",
  description: "Assign Auth users to Comp entrants",
};

export default async function Page() {
  const users = await api.user.getAll();
  const entrants = await api.entrant.getAll();

  return (
    <LibMain>
      <div className="flex flex-col items-center">
        <LibH1>Users</LibH1>
      </div>
      <LibCardContainer>
        <LibCard title="User/Entrant Mapping">
          {entrants.map((entrant) => {
            return (
              <div
                key={entrant.id}
                className="mb-1 flex items-center justify-between border-t px-4 pt-1"
              >
                <div>{entrant.name}</div>
                <UserSelect
                  users={users.map((user) => {
                    return {
                      name: `${user.firstName} ${user.surname}`,
                      id: user.id,
                      entrantId: user.entrant?.id,
                    };
                  })}
                  currentValue={entrant.userId}
                  entrantId={entrant.id}
                  entrantName={entrant.name}
                />
              </div>
            );
          })}
        </LibCard>
      </LibCardContainer>
    </LibMain>
  );
}
