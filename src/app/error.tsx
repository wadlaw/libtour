"use client";

import LibMain, { LibH1 } from "./_components/lib-elements";

export default function Error() {
  return (
    <>
      <LibMain>
        <div className="flex flex-col items-center">
          <LibH1>Uh-oh</LibH1>
          <p>Some kind of error has occurred. Sad face x100 :(</p>
        </div>
      </LibMain>
    </>
  );
}
