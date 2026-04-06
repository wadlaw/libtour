-- CreateTable
CREATE TABLE "blindmatchplayentrants" (
    "id" SERIAL NOT NULL,
    "displayname" TEXT NOT NULL,
    "systemname" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "blindmatchplayentrants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blindmatchplayscorecards" (
    "id" SERIAL NOT NULL,
    "compid" TEXT NOT NULL,
    "entrantid" INTEGER NOT NULL,
    "handicap" INTEGER NOT NULL,
    "stableford" BOOLEAN NOT NULL,
    "nr" BOOLEAN NOT NULL DEFAULT false,
    "strokes" INTEGER,
    "strokescountback" BIGINT,
    "points" INTEGER NOT NULL,
    "pointscountback" BIGINT NOT NULL,
    "net" INTEGER,
    "netcountback" BIGINT,

    CONSTRAINT "blindmatchplayscorecards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blindmatchplayholes" (
    "id" SERIAL NOT NULL,
    "scorecardid" INTEGER NOT NULL,
    "holeno" INTEGER NOT NULL,
    "par" INTEGER NOT NULL,
    "strokeindex" INTEGER NOT NULL,
    "strokes" INTEGER,
    "nr" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL DEFAULT 0,
    "net" INTEGER,

    CONSTRAINT "blindmatchplayholes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blindmatchplayentrants_displayname_key" ON "blindmatchplayentrants"("displayname");

-- CreateIndex
CREATE UNIQUE INDEX "blindmatchplayentrants_systemname_key" ON "blindmatchplayentrants"("systemname");

-- CreateIndex
CREATE UNIQUE INDEX "blindmatchplayscorecards_compid_entrantid_key" ON "blindmatchplayscorecards"("compid", "entrantid");

-- CreateIndex
CREATE UNIQUE INDEX "blindmatchplayholes_scorecardid_holeno_key" ON "blindmatchplayholes"("scorecardid", "holeno");

-- AddForeignKey
ALTER TABLE "blindmatchplayscorecards" ADD CONSTRAINT "blindmatchplayscorecards_compid_fkey" FOREIGN KEY ("compid") REFERENCES "comps"("igcompid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blindmatchplayscorecards" ADD CONSTRAINT "blindmatchplayscorecards_entrantid_fkey" FOREIGN KEY ("entrantid") REFERENCES "blindmatchplayentrants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blindmatchplayholes" ADD CONSTRAINT "blindmatchplayholes_scorecardid_fkey" FOREIGN KEY ("scorecardid") REFERENCES "blindmatchplayscorecards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
