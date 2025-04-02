import { z } from "zod";

import { createTRPCRouter, adminProcedure, publicProcedure } from "~/server/api/trpc";

const CalculatePoints = (strokes: number | undefined, par: number, si: number, hcp: number, nr: boolean) => {
    if (nr || typeof(strokes) === 'undefined') {return 0}
    
    let shotsReceived = 0
    
    if (hcp < 0) {
        shotsReceived = 19 + hcp > si ? 0 : -1
    } else if (hcp > 0) {
        const shotsEveryHole = Math.trunc(hcp / 18)
        const shotsThisHole = hcp % 18 >= si ? 1 : 0
        shotsReceived = shotsEveryHole + shotsThisHole
    }
    
    const netStrokes = strokes - shotsReceived

    return Math.max(2 + (par - netStrokes),0)  
}

const CalculateNet = (strokes: number | undefined, par: number, si: number, hcp: number, nr: boolean) => {
    if (nr || typeof(strokes) === 'undefined') {return null}
    
    let shotsReceived = 0
    
    if (hcp < 0) {
        shotsReceived = 19 + hcp > si ? 0 : -1
    } else if (hcp > 0) {
        const shotsEveryHole = Math.trunc(hcp / 18)
        const shotsThisHole = hcp % 18 >= si ? 1 : 0
        shotsReceived = shotsEveryHole + shotsThisHole
    }
    
    const netStrokes = strokes - shotsReceived

    return netStrokes 
}

const libbetsCard = [
    {holeNo: 1, par: 4, strokeIndex: 12},
    {holeNo: 2, par: 5, strokeIndex: 6},
    {holeNo: 3, par: 4, strokeIndex: 2},
    {holeNo: 4, par: 3, strokeIndex: 16},
    {holeNo: 5, par: 5, strokeIndex: 4},
    {holeNo: 6, par: 4, strokeIndex: 14},
    {holeNo: 7, par: 4, strokeIndex: 8},
    {holeNo: 8, par: 3, strokeIndex: 18},
    {holeNo: 9, par: 4, strokeIndex: 10},
    {holeNo: 10, par: 4, strokeIndex: 9},
    {holeNo: 11, par: 4, strokeIndex: 1},
    {holeNo: 12, par: 4, strokeIndex: 11},
    {holeNo: 13, par: 4, strokeIndex: 13},
    {holeNo: 14, par: 4, strokeIndex: 3},
    {holeNo: 15, par: 3, strokeIndex: 15},
    {holeNo: 16, par: 5, strokeIndex: 7},
    {holeNo: 17, par: 3, strokeIndex: 17},
    {holeNo: 18, par: 5, strokeIndex: 5},
]

export const scorecardRouter = createTRPCRouter({
    addMany: adminProcedure
        .input(z.object({compId: z.string(), entrantId: z.number(), handicap: z.number(), stableford: z.boolean(), NR: z.boolean().optional().nullable().default(null), gross: z.number().optional().nullable().default(null), points: z.number().optional().default(0), net: z.number().optional().nullable().default(null), holes: z.object({ holeNo: z.number(), strokes: z.number().optional(), NR: z.boolean(), points: z.number().optional().default(0) , net: z.number().optional().nullable().default(null) }).array()}).array())
        .mutation(async ({ ctx, input }) => {

            await ctx.db.$transaction(input.map(sc => {
                //Calculate points and net score for each hole
                sc.holes.forEach(hole => {
                    hole.points = CalculatePoints(hole.strokes, libbetsCard[hole.holeNo - 1]?.par ?? 4, libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19, sc.handicap, hole.NR ),
                    hole.net = CalculateNet(hole.strokes, libbetsCard[hole.holeNo - 1]?.par ?? 4, libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19, sc.handicap, hole.NR )
                }) 
                //Update scorecard properties with scores
                sc.NR = sc.holes.filter(hole => hole.NR).length > 0
                if (!sc.NR) {
                    sc.gross = sc.holes.reduce((acc, cur) => acc + (cur.strokes ?? 0), 0)
                    sc.net = sc.holes.reduce((acc, cur) => acc + (cur.net ?? 0), 0)
                }
                sc.points = sc.holes.reduce((acc, cur) => acc + (cur.points ?? 0), 0)

                return ctx.db.compEntrant.update({
                    where: {
                        compId_entrantId: {
                            compId: sc.compId,
                            entrantId: sc.entrantId
                        }
                    },
                    data: {
                        scorecard: {
                            create: {
                                handicap: sc.handicap,
                                stableford: sc.stableford,
                                NR: (sc.holes.filter(hole => hole.NR === true).length > 0),
                                points: sc.points,
                                net: sc.net,
                                strokes: sc.gross,
                                pointsCountback: 100_000_000 * sc.points +
                                                   1_000_000 * sc.holes.filter(h => h.holeNo >= 10).reduce((acc, cur) => acc + cur.points,0) +
                                                      10_000 * sc.holes.filter(h => h.holeNo >= 13).reduce((acc, cur) => acc + cur.points,0) +
                                                         100 * sc.holes.filter(h => h.holeNo >= 16).reduce((acc, cur) => acc + cur.points,0) +
                                                           1 * sc.holes.filter(h => h.holeNo >= 18).reduce((acc, cur) => acc + cur.points,0),
                                strokesCountback: sc.gross ? 
                                                100_000_000 * sc.gross +
                                                  1_000_000 * sc.holes.filter(h => h.holeNo >= 10).reduce((acc, cur) => acc + (cur.strokes ?? 0),0) +
                                                     10_000 * sc.holes.filter(h => h.holeNo >= 13).reduce((acc, cur) => acc + (cur.strokes ?? 0),0) +
                                                        100 * sc.holes.filter(h => h.holeNo >= 16).reduce((acc, cur) => acc + (cur.strokes ?? 0),0) +
                                                          1 * sc.holes.filter(h => h.holeNo >= 18).reduce((acc, cur) => acc + (cur.strokes ?? 0),0)
                                         : null,
                                netCountback: sc.net ? 
                                                100_000_000 * sc.net +
                                                  1_000_000 * sc.holes.filter(h => h.holeNo >= 10).reduce((acc, cur) => acc + (cur.net ?? 0),0) +
                                                     10_000 * sc.holes.filter(h => h.holeNo >= 13).reduce((acc, cur) => acc + (cur.net ?? 0),0) +
                                                        100 * sc.holes.filter(h => h.holeNo >= 16).reduce((acc, cur) => acc + (cur.net ?? 0),0) +
                                                          1 * sc.holes.filter(h => h.holeNo >= 18).reduce((acc, cur) => acc + (cur.net ?? 0),0)
                                  : null,
                                holes: {
                                    createMany: {
                                        data: sc.holes.map(hole => {
                                            return { 
                                                holeNo: hole.holeNo, 
                                                par: libbetsCard[hole.holeNo - 1]?.par ?? 4,
                                                strokeIndex: libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19,
                                                strokes: hole.strokes,
                                                NR: hole.NR,
                                                // points: CalculatePoints(hole.strokes, libbetsCard[hole.holeNo - 1]?.par ?? 4, libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19, sc.handicap, hole.NR ),
                                                // net: CalculateNet(hole.strokes, libbetsCard[hole.holeNo - 1]?.par ?? 4, libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19, sc.handicap, hole.NR )
                                                points: hole.points,
                                                net: hole.net
                                            }
                                        })

                                    }
                                }
                            }
                        }
                    }
                 })
                
                
            }))
            
            
        
      
        }),

        addManyEclectic: adminProcedure
        .input(z.object({compId: z.string(), eclecticEntrantId: z.number(), handicap: z.number(), stableford: z.boolean(), NR: z.boolean().optional().nullable().default(null), gross: z.number().optional().nullable().default(null), points: z.number().optional().default(0), net: z.number().optional().nullable().default(null), holes: z.object({ holeNo: z.number(), strokes: z.number().optional(), NR: z.boolean(), points: z.number().optional().default(0) , net: z.number().optional().nullable().default(null) }).array()}).array())
        .mutation(async ({ ctx, input }) => {

            await ctx.db.$transaction(input.map(sc => {
                //Calculate points and net score for each hole
                sc.holes.forEach(hole => {
                    hole.points = CalculatePoints(hole.strokes, libbetsCard[hole.holeNo - 1]?.par ?? 4, libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19, sc.handicap, hole.NR ),
                    hole.net = CalculateNet(hole.strokes, libbetsCard[hole.holeNo - 1]?.par ?? 4, libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19, sc.handicap, hole.NR )
                }) 
                //Update scorecard properties with scores
                sc.NR = sc.holes.filter(hole => hole.NR).length > 0
                if (!sc.NR) {
                    sc.gross = sc.holes.reduce((acc, cur) => acc + (cur.strokes ?? 0), 0)
                    sc.net = sc.holes.reduce((acc, cur) => acc + (cur.net ?? 0), 0)
                }
                sc.points = sc.holes.reduce((acc, cur) => acc + (cur.points ?? 0), 0)

                return ctx.db.eclecticEntrant.update({
                    where: {
                        id: sc.eclecticEntrantId
                    },
                    data: {
                        scorecards: {
                            create: {
                                compId: sc.compId,
                                handicap: sc.handicap,
                                stableford: sc.stableford,
                                NR: (sc.holes.filter(hole => hole.NR === true).length > 0),
                                points: sc.points,
                                net: sc.net,
                                strokes: sc.gross,
                                pointsCountback: 100_000_000 * sc.points +
                                                   1_000_000 * sc.holes.filter(h => h.holeNo >= 10).reduce((acc, cur) => acc + cur.points,0) +
                                                      10_000 * sc.holes.filter(h => h.holeNo >= 13).reduce((acc, cur) => acc + cur.points,0) +
                                                         100 * sc.holes.filter(h => h.holeNo >= 16).reduce((acc, cur) => acc + cur.points,0) +
                                                           1 * sc.holes.filter(h => h.holeNo >= 18).reduce((acc, cur) => acc + cur.points,0),
                                strokesCountback: sc.gross ? 
                                                100_000_000 * sc.gross +
                                                  1_000_000 * sc.holes.filter(h => h.holeNo >= 10).reduce((acc, cur) => acc + (cur.strokes ?? 0),0) +
                                                     10_000 * sc.holes.filter(h => h.holeNo >= 13).reduce((acc, cur) => acc + (cur.strokes ?? 0),0) +
                                                        100 * sc.holes.filter(h => h.holeNo >= 16).reduce((acc, cur) => acc + (cur.strokes ?? 0),0) +
                                                          1 * sc.holes.filter(h => h.holeNo >= 18).reduce((acc, cur) => acc + (cur.strokes ?? 0),0)
                                         : null,
                                netCountback: sc.net ? 
                                                100_000_000 * sc.net +
                                                  1_000_000 * sc.holes.filter(h => h.holeNo >= 10).reduce((acc, cur) => acc + (cur.net ?? 0),0) +
                                                     10_000 * sc.holes.filter(h => h.holeNo >= 13).reduce((acc, cur) => acc + (cur.net ?? 0),0) +
                                                        100 * sc.holes.filter(h => h.holeNo >= 16).reduce((acc, cur) => acc + (cur.net ?? 0),0) +
                                                          1 * sc.holes.filter(h => h.holeNo >= 18).reduce((acc, cur) => acc + (cur.net ?? 0),0)
                                  : null,
                                holes: {
                                    createMany: {
                                        data: sc.holes.map(hole => {
                                            return { 
                                                holeNo: hole.holeNo, 
                                                par: libbetsCard[hole.holeNo - 1]?.par ?? 4,
                                                strokeIndex: libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19,
                                                strokes: hole.strokes,
                                                NR: hole.NR,
                                                // points: CalculatePoints(hole.strokes, libbetsCard[hole.holeNo - 1]?.par ?? 4, libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19, sc.handicap, hole.NR ),
                                                // net: CalculateNet(hole.strokes, libbetsCard[hole.holeNo - 1]?.par ?? 4, libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19, sc.handicap, hole.NR )
                                                points: hole.points,
                                                net: hole.net
                                            }
                                        })

                                    }
                                }
                            }
                        }
                    }
                 })
                
                
            }))
            
            
        
      
        }),
    
    eagles: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.hole.findMany({
                where: {
                    OR: [
                        {
                            NR: false,
                            strokes: { lte: 3 },
                            par: 5
                        },
                        {
                            NR: false,
                            strokes: { lte: 2 },
                            par: 4
                        },
                    ]
                    
                },
                orderBy: {
                    scorecard: {
                        compEntrant: {
                            comp: 
                                {date: 'desc'}
                            
                        }
                    }
                },
                include: {
                    scorecard: {
                        include: {
                            holes: {
                                orderBy: {
                                    holeNo: 'asc'
                                }
                            },
                            compEntrant: {
                                include: {
                                    comp: true,
                                    entrant: true
                                }   
                            }
                        }
                    }
                }
            })
        }),

        holesInOne: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.hole.findMany({
                where: {
                            NR: false,
                            strokes: 1,
                },
                orderBy: {
                    scorecard: {
                        compEntrant: {
                            comp: 
                                {date: 'desc'}
                        }
                    }
                },
                include: {
                    scorecard: {
                        include: {
                            holes: {
                                orderBy: {
                                    holeNo: 'asc'
                                }
                            },
                            compEntrant: {
                                include: {
                                    comp: true,
                                    entrant: true
                                }   
                            }
                        }
                    }
                }
            })
        }),

        doubleFigures: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.hole.findMany({
                where: {
                            NR: false,
                            strokes: {gte: 10},
                },
                orderBy: [
                    { strokes: 'desc'},
                    { scorecard: {
                        compEntrant: {
                            comp: 
                                {date: 'desc'}
                        }
                    }}
                ],
                include: {
                    scorecard: {
                        include: {
                            holes: {
                                orderBy: {
                                    holeNo: 'asc'
                                }
                            },
                            compEntrant: {
                                include: {
                                    comp: true,
                                    entrant: true
                                }   
                            }
                        }
                    }
                }
            })
        }),

        bestStablefordRounds: publicProcedure
            .input(z.object({ numberOfRounds: z.number() }))
            .query(async ({ ctx, input }) => {

                return ctx.db.scorecard.findMany({
                    include: {
                        holes: true,
                        compEntrant: {
                            include: {
                                comp: true,
                                entrant: true
                            }
                        }
                    },
                    where: {
                        stableford: true
                    },
                    orderBy: [
                        { pointsCountback: `desc` }
                    ],
                    take: input.numberOfRounds
                })
            }),

        worstStablefordRounds: publicProcedure
            .input(z.object({ numberOfRounds: z.number() }))
            .query(async ({ ctx, input }) => {

                return ctx.db.scorecard.findMany({
                    include: {
                        holes: true,
                        compEntrant: {
                            include: {
                                comp: true,
                                entrant: true
                            }
                        }
                    },
                    where: {
                        stableford: true,
                        NR: false
                    },
                    orderBy: [
                        { pointsCountback: `asc` }
                    ],
                    take: input.numberOfRounds
                })
            }),

        bestMedalRounds: publicProcedure
            .input(z.object({ numberOfRounds: z.number() }))
            .query(async ({ ctx, input }) => {

                return ctx.db.scorecard.findMany({
                    include: {
                        holes: true,
                        compEntrant: {
                            include: {
                                comp: true,
                                entrant: true
                            }
                        }
                    },
                    where: {
                        stableford: false,
                        NR: false
                    },
                    orderBy: [
                        { netCountback: `asc` }
                    ],
                    take: input.numberOfRounds
                })
            }),

        worstMedalRounds: publicProcedure
            .input(z.object({ numberOfRounds: z.number() }))
            .query(async ({ ctx, input }) => {

                return ctx.db.scorecard.findMany({
                    include: {
                        holes: true,
                        compEntrant: {
                            include: {
                                comp: true,
                                entrant: true
                            }
                        }
                    },
                    where: {
                        stableford: false,
                        NR: false
                    },
                    orderBy: [
                        { netCountback: `desc` }
                    ],
                    take: input.numberOfRounds
                })
            }),

        bestGrossRounds: publicProcedure
            .input(z.object({ numberOfRounds: z.number() }))
            .query(async ({ ctx, input }) => {

                return ctx.db.scorecard.findMany({
                    include: {
                        holes: true,
                        compEntrant: {
                            include: {
                                comp: true,
                                entrant: true
                            }
                        }
                    },
                    where: {
                        NR: false
                    },
                    orderBy: [
                        { strokesCountback: `asc` }
                    ],
                    take: input.numberOfRounds
                })
            }),   
        
        worstGrossRounds: publicProcedure
            .input(z.object({ numberOfRounds: z.number() }))
            .query(async ({ ctx, input }) => {

                return ctx.db.scorecard.findMany({
                    include: {
                        holes: true,
                        compEntrant: {
                            include: {
                                comp: true,
                                entrant: true
                            }
                        }
                    },
                    where: {
                        NR: false
                    },
                    orderBy: [
                        { strokesCountback: `desc` }
                    ],
                    take: input.numberOfRounds
                })
            }),   
        
        LibEclecticScores: publicProcedure
            .query(async ({ ctx }) => {
                return ctx.db.entrant.findMany({
                    include: {
                        team: true,
                        comps: {
                            include: {
                                scorecard: {
                                    include: {
                                        holes: {
                                            orderBy: {
                                                holeNo: "asc"
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                })
            }),

        EclecticScores: publicProcedure
            .query(async ({ ctx }) => {
                return ctx.db.eclecticEntrant.findMany({
                    include: {
                        scorecards: {
                            include: {
                                comp: true,
                                holes: true,
                            }
                        }
                    }


                })
            }),
})